const API_URL = 'http://localhost:3001/api';

class ApiService {
    // Products
    async getProducts() {
        const res = await fetch(`${API_URL}/products`);
        return res.json();
    }

    async getProduct(id: string) {
        const res = await fetch(`${API_URL}/products/${id}`);
        return res.json();
    }

    async createProduct(product: any) {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return res.json();
    }

    async updateProduct(id: string, product: any) {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return res.json();
    }

    async deleteProduct(id: string) {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    }

    async bulkUpdateProducts(products: any[], replace = false) {
        const res = await fetch(`${API_URL}/products/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products, replace })
        });
        return res.json();
    }

    // Images
    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        return res.json();
    }

    async uploadMultipleImages(files: File[]) {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        const res = await fetch(`${API_URL}/upload/multiple`, {
            method: 'POST',
            body: formData
        });
        return res.json();
    }

    async deleteImage(filename: string) {
        const res = await fetch(`${API_URL}/images/${filename}`, {
            method: 'DELETE'
        });
        return res.json();
    }

    // Reviews
    async getReviews(productId: string) {
        const res = await fetch(`${API_URL}/products/${productId}/reviews`);
        return res.json();
    }

    async addReview(productId: string, review: any) {
        const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });
        return res.json();
    }
}

export const api = new ApiService();
