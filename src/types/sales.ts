import type { Product } from './index';

export interface Sale {
    id: string;
    productId: string | number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    date: Date;
}

export interface SalesStats {
    today: number;
    thisMonth: number;
    thisYear: number;
    totalRevenue: number;
}

export interface ProductRanking {
    product: Product;
    totalSold: number;
    revenue: number;
}
