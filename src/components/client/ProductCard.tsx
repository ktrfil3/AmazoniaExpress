import { Plus, Minus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, items, updateQuantity } = useCartStore();
    const { format } = useCurrencyStore();

    const cartItem = items.find(item => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity === 0) {
            addToCart(product);
        } else {
            updateQuantity(product.id, quantity + 1);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity > 0) {
            updateQuantity(product.id, quantity - 1);
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="block">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                            {product.categoria === 'Maquillaje y Cuidado Personal' ? 'Cuidado' : product.categoria}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="mb-3">
                        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                            {product.nombre}
                        </h3>
                        {product.rating && product.rating > 0 ? (
                            <div className="flex items-center gap-1.5 text-xs">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 ${star <= Math.round(product.rating!)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600">{product.rating.toFixed(1)}</span>
                                {product.variaciones && product.variaciones.length > 0 && (
                                    <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{product.variaciones.length} variaciones</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Nuevo producto</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                            {format(product.precio)}
                        </span>

                        {quantity === 0 ? (
                            <button
                                onClick={handleAdd}
                                className="bg-uber-500 hover:bg-uber-600 text-white p-2.5 rounded-lg transition-all active:scale-95 shadow-sm"
                            >
                                <Plus size={18} strokeWidth={2.5} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-uber-500 rounded-lg shadow-sm">
                                <button
                                    onClick={handleRemove}
                                    className="text-white p-2 hover:bg-uber-600 rounded-l-lg transition-colors"
                                >
                                    <Minus size={16} strokeWidth={2.5} />
                                </button>
                                <span className="text-white font-bold text-sm min-w-[20px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={handleAdd}
                                    className="text-white p-2 hover:bg-uber-600 rounded-r-lg transition-colors"
                                >
                                    <Plus size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
