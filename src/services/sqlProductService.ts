import type { Product } from '../types';

export const fetchProductsFromDB = async (): Promise<Product[]> => {
    try {
        // Determine API URL based on environment
        // If testing locally with 'vite', we usually need to proxy to the backend or use absolute URL if CORS allowed
        // Ideally Vercel dev handles this. 
        // For now, let's assume relative path works if proxy is set up, or fallback to localhost:3000 where Vercel CLI runs
        const apiUrl = '/api/products';

        const response = await fetch(apiUrl);
        if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.details) errorMessage = errorData.details;
                else if (errorData.error) errorMessage = errorData.error;
            } catch (e) {
                // Ignore JSON parse error, use status text
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();
        return data as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        // Throwing error to let the store handle it and potentially show UI feedback
        throw error;
    }
};
