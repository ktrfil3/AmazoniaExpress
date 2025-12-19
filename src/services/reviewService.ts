import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Review } from '../types';

const REVIEWS_COLLECTION = 'reviews';

export const reviewService = {
    // Add a new review
    async addReview(review: Omit<Review, 'id' | 'fecha'>) {
        try {
            const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
                ...review,
                fecha: Timestamp.now()
            });
            console.log('Review added successfully with ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    },

    // Get reviews for a specific product
    async getReviews(productId: string): Promise<Review[]> {
        try {
            const q = query(
                collection(db, REVIEWS_COLLECTION),
                where('productId', '==', productId),
                orderBy('fecha', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    fecha: data.fecha.toDate().toISOString() // Convert Timestamp to ISO string for frontend
                } as Review;
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    },

    // Get all reviews (for admin stats)
    async getAllReviews(): Promise<Review[]> {
        try {
            const snapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    fecha: data.fecha.toDate().toISOString()
                } as Review;
            });
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            return [];
        }
    },

    // Get stats: Top rated and Bottom rated products
    async getReviewStats(products: any[]) { // Pass products to map IDs to names
        const reviews = await this.getAllReviews();

        const productStats = new Map<string, {
            id: string;
            name: string;
            ratingSum: number;
            count: number;
            image: string
        }>();

        // Aggregate ratings
        reviews.forEach(review => {
            if (!productStats.has(review.productId)) {
                const product = products.find(p => p.id.toString() === review.productId);
                productStats.set(review.productId, {
                    id: review.productId,
                    name: product ? product.nombre : 'Producto Desconocido',
                    image: product ? product.imagen : '',
                    ratingSum: 0,
                    count: 0
                });
            }

            const stats = productStats.get(review.productId)!;
            stats.ratingSum += review.rating;
            stats.count += 1;
        });

        // Calculate averages
        const statsArray = Array.from(productStats.values()).map(stat => ({
            ...stat,
            averageRating: stat.ratingSum / stat.count
        }));

        // Sort for Top 10
        const topRated = [...statsArray]
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 10);

        // Sort for Bottom 10 (only those with ratings)
        const bottomRated = [...statsArray]
            .sort((a, b) => a.averageRating - b.averageRating)
            .slice(0, 10);

        return { topRated, bottomRated };
    }
};
