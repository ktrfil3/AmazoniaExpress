import { create } from 'zustand';
import type { Product } from '../types';
// import { mockProducts } from '../data/mockData';

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    fetchProducts: () => Promise<void>;
    resetToMock: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [], // Start empty, will fetch
    isLoading: false,
    error: null,
    setProducts: (products) => set({ products }),
    addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            // import dynamically or normally
            const { fetchProductsFromDB } = await import('../services/sqlProductService');
            const data = await fetchProductsFromDB();
            if (data.length > 0) {
                set({ products: data, isLoading: false });
            } else {
                // Fallback to mock if DB fails or empty in dev
                // const { mockProducts } = await import('../data/mockData');
                // set({ products: mockProducts, isLoading: false });
                set({ products: [], isLoading: false }); // Or keep empty
            }
        } catch (err) {
            set({ error: 'Failed to fetch products', isLoading: false });
        }
    },
    resetToMock: async () => {
        const { mockProducts } = await import('../data/mockData');
        set({ products: mockProducts });
    }
}));
