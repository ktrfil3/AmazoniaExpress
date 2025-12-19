import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { CartItem } from '../types';

export interface SaleData {
    id?: string;
    items: CartItem[];
    total: number;
    customerName?: string;
    customerPhone?: string;
    date: Date;
    paymentMethod: string;
}

const SALES_COLLECTION = 'sales';

export const analyticsService = {
    // Record a new sale
    async recordSale(sale: Omit<SaleData, 'date'>) {
        try {
            await addDoc(collection(db, SALES_COLLECTION), {
                ...sale,
                date: Timestamp.now()
            });
            console.log('Sale recorded successfully');
        } catch (error) {
            console.error('Error recording sale:', error);
            // Don't throw, we don't want to block the user flow if analytics fails
        }
    },

    // Get all sales
    async getAllSales(): Promise<SaleData[]> {
        const q = query(collection(db, SALES_COLLECTION), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date.toDate()
            } as SaleData;
        });
    },

    // Reset all sales data (Super Admin only)
    async resetSales() {
        try {
            const snapshot = await getDocs(collection(db, SALES_COLLECTION));
            const batch = writeBatch(db);
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            console.log('All sales data reset');
        } catch (error) {
            console.error('Error resetting sales:', error);
            throw error;
        }
    },

    // Get aggregated metrics
    async getMetrics() {
        const sales = await this.getAllSales();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisYear = new Date(now.getFullYear(), 0, 1);

        const metrics = {
            totalRevenue: 0,
            totalTransactions: sales.length,
            todaySales: 0,
            monthSales: 0,
            yearSales: 0,
            topProducts: [] as { name: string; quantity: number; revenue: number }[]
        };

        const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

        sales.forEach(sale => {
            const saleDate = sale.date;
            metrics.totalRevenue += sale.total;

            if (saleDate >= today) metrics.todaySales += sale.total;
            if (saleDate >= thisMonth) metrics.monthSales += sale.total;
            if (saleDate >= thisYear) metrics.yearSales += sale.total;

            sale.items.forEach(item => {
                const current = productMap.get(item.id.toString()) || {
                    name: item.nombre,
                    quantity: 0,
                    revenue: 0
                };
                current.quantity += item.quantity;
                current.revenue += item.precio * item.quantity;
                productMap.set(item.id.toString(), current);
            });
        });

        metrics.topProducts = Array.from(productMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        return metrics;
    }
};
