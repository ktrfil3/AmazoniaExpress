import { useState } from 'react';
import { Star, User } from 'lucide-react';
import type { Review } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

interface ProductReviewsProps {
    productId: string;
    reviews: Review[];
    rating: number;
    totalReviews: number;
    onReviewAdded: () => void;
}

export const ProductReviews = ({ productId, reviews, rating, totalReviews, onReviewAdded }: ProductReviewsProps) => {
    const { user } = useAuthStore();
    const [showForm, setShowForm] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Debes iniciar sesión para dejar una reseña');
            return;
        }

        setSubmitting(true);
        try {
            await api.addReview(productId, {
                usuario: user.name || 'Usuario',
                rating: newRating,
                comentario: comment
            });
            setComment('');
            setNewRating(5);
            setShowForm(false);
            onReviewAdded();
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Error al agregar reseña');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number, size = 'w-5 h-5') => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</div>
                    {renderStars(Math.round(rating))}
                    <div className="text-sm text-gray-500 mt-1">{totalReviews} reseñas</div>
                </div>
            </div>

            {/* Add Review Button */}
            {user && !showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 border-2 border-uber-500 text-uber-600 font-semibold rounded-xl hover:bg-uber-50 transition-colors"
                >
                    Escribir una reseña
                </button>
            )}

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tu calificación
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tu comentario
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-uber-500 rounded-xl outline-none resize-none"
                            placeholder="Comparte tu experiencia con este producto..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-uber-500 hover:bg-uber-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Enviando...' : 'Publicar reseña'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <User className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{review.usuario}</h4>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.fecha).toLocaleDateString('es')}
                                    </span>
                                </div>
                                {renderStars(review.rating, 'w-4 h-4')}
                                <p className="text-gray-700 mt-3">{review.comentario}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <p>No hay reseñas aún. ¡Sé el primero en opinar!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
