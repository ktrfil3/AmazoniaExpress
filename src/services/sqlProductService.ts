import type { Product } from '../types';

export const fetchProductsFromDB = async (): Promise<Product[]> => {
    try {
        // Determine API URL based on environment
        const apiUrl = import.meta.env.PROD
            ? '/api/products' // In production (Vercel), mapped to same domain
            : 'http://localhost:3000/api/products'; // Local dev needs Vercel CLI running

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
