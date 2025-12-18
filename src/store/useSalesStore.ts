import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sale, SalesStats, ProductRanking } from '../types/sales';
import type { Product, Department } from '../types';

interface SalesState {
    sales: Sale[];
    addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
    generateMockSales: () => void;
    getStats: () => SalesStats;
    getTopProducts: (limit?: number) => ProductRanking[];
    getSalesByPeriod: (days: number) => Sale[];
}

export const useSalesStore = create<SalesState>()(
    persist(
        (set, get) => ({
            sales: [],

            addSale: (saleData) => {
                const newSale: Sale = {
                    ...saleData,
                    id: Date.now().toString(),
                    date: new Date(),
                };
                set((state) => ({ sales: [...state.sales, newSale] }));
            },

            generateMockSales: () => {
                const mockSales: Sale[] = [];
                const now = new Date();

                // Generate 50 random sales over the last 30 days
                for (let i = 0; i < 50; i++) {
                    const daysAgo = Math.floor(Math.random() * 30);
                    const date = new Date(now);
                    date.setDate(date.getDate() - daysAgo);

                    const productNames = ['Arroz', 'Aceite', 'Harina', 'Azúcar', 'Café', 'Pasta', 'Leche', 'Pan'];
                    const productName = productNames[Math.floor(Math.random() * productNames.length)];
                    const quantity = Math.floor(Math.random() * 5) + 1;
                    const price = Math.random() * 20 + 5;

                    mockSales.push({
                        id: `mock-${i}`,
                        productId: i,
                        productName,
                        quantity,
                        price,
                        total: quantity * price,
                        date,
                    });
                }

                set({ sales: mockSales });
            },

            getStats: () => {
                const sales = get().sales;
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const thisYear = new Date(now.getFullYear(), 0, 1);

                const stats: SalesStats = {
                    today: 0,
                    thisMonth: 0,
                    thisYear: 0,
                    totalRevenue: 0,
                };

                sales.forEach((sale) => {
                    const saleDate = new Date(sale.date);
                    stats.totalRevenue += sale.total;

                    if (saleDate >= today) stats.today += sale.total;
                    if (saleDate >= thisMonth) stats.thisMonth += sale.total;
                    if (saleDate >= thisYear) stats.thisYear += sale.total;
                });

                return stats;
            },

            getTopProducts: (limit = 5) => {
                const sales = get().sales;
                const productMap = new Map<string, { totalSold: number; revenue: number; name: string }>();

                sales.forEach((sale) => {
                    const key = sale.productId.toString();
                    const existing = productMap.get(key) || { totalSold: 0, revenue: 0, name: sale.productName };
                    productMap.set(key, {
                        totalSold: existing.totalSold + sale.quantity,
                        revenue: existing.revenue + sale.total,
                        name: sale.productName,
                    });
                });

                return Array.from(productMap.entries())
                    .map(([id, data]) => ({
                        product: {
                            id,
                            nombre: data.name,
                            precio: 0,
                            stock: 0,
                            categoria: 'Víveres' as Department,
                            imagen: '',
                        } as Product,
                        totalSold: data.totalSold,
                        revenue: data.revenue,
                    }))
                    .sort((a, b) => b.totalSold - a.totalSold)
                    .slice(0, limit);
            },

            getSalesByPeriod: (days) => {
                const sales = get().sales;
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);
                return sales.filter((sale) => new Date(sale.date) >= cutoff);
            },
        }),
        {
            name: 'sales-storage',
        }
    )
);
