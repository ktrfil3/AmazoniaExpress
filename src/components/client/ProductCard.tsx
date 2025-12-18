import { useState } from 'react';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, items, updateQuantity } = useCartStore();
    const { format } = useCurrencyStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const [pricingMode, setPricingMode] = useState<'unit' | 'wholesale'>('unit');

    // Determine effective ID based on mode
    const effectiveId = pricingMode === 'wholesale' ? `${product.id}-wholesale` : product.id;
    const cartItem = items.find(item => item.id === effectiveId);
    const quantity = cartItem?.quantity || 0;

    const hasWholesalePrice = product.precioMayor && product.precioMayor > 0 && product.precioMayor !== product.precio;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (pricingMode === 'wholesale') {
            // Create wholesale variant
            const wholesaleProduct = {
                ...product,
                id: effectiveId,
                nombre: `${product.nombre} (Al Mayor)`,
                precio: product.precioMayor!
            };
            if (quantity === 0) {
                addToCart(wholesaleProduct);
            } else {
                updateQuantity(effectiveId, quantity + 1);
            }
        } else {
            // Standard unit product
            if (quantity === 0) {
                addToCart(product);
            } else {
                updateQuantity(product.id, quantity + 1);
            }
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity > 0) {
            updateQuantity(effectiveId, quantity - 1);
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="block h-full">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
                <div className="relative h-40 overflow-hidden flex-shrink-0">
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

                    {/* Favorite Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-all z-10"
                    >
                        <Heart
                            size={18}
                            className={`transition-colors ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        />
                    </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-3 flex-grow">
                        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                            {product.nombre}
                        </h3>

                        {/* Rating or New Badge */}
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
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Nuevo producto</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto space-y-3">
                        {/* Price Toggle */}
                        {hasWholesalePrice ? (
                            <div className="flex bg-gray-100 p-1 rounded-lg" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                <button
                                    onClick={() => setPricingMode('unit')}
                                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${pricingMode === 'unit'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Detal
                                </button>
                                <button
                                    onClick={() => setPricingMode('wholesale')}
                                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${pricingMode === 'wholesale'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Mayor
                                </button>
                            </div>
                        ) : (
                            <div className="h-[28px]"></div> // Spacer to align cards
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium">
                                    {pricingMode === 'unit' ? 'Precio Unitario' : 'Precio al Mayor'}
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {format(pricingMode === 'unit' ? product.precio : product.precioMayor!)}
                                </span>
                            </div>

                            {quantity === 0 ? (
                                <button
                                    onClick={handleAdd}
                                    className={`p-2.5 rounded-lg transition-all active:scale-95 shadow-sm ${pricingMode === 'wholesale'
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-uber-500 hover:bg-uber-600 text-white'
                                        }`}
                                >
                                    <Plus size={18} strokeWidth={2.5} />
                                </button>
                            ) : (
                                <div className={`flex items-center gap-2 rounded-lg shadow-sm ${pricingMode === 'wholesale' ? 'bg-purple-600' : 'bg-uber-500'
                                    }`}>
                                    <button
                                        onClick={handleRemove}
                                        className="text-white p-2 hover:bg-black/10 rounded-l-lg transition-colors"
                                    >
                                        <Minus size={16} strokeWidth={2.5} />
                                    </button>
                                    <span className="text-white font-bold text-sm min-w-[20px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleAdd}
                                        className="text-white p-2 hover:bg-black/10 rounded-r-lg transition-colors"
                                    >
                                        <Plus size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
