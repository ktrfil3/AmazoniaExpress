import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, Star, Heart } from 'lucide-react';
import { ImageGallery } from '../components/client/ImageGallery';
import { VariationSelector } from '../components/client/VariationSelector';
import { ProductReviews } from '../components/client/ProductReviews';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import type { Product, Review } from '../types';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { addItem } = useCartStore();
    const { products } = useProductStore();
    const { format } = useCurrencyStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProduct();
    }, [id, products]);

    const loadProduct = async () => {
        if (!id) return;

        setLoading(true);

        // Find product from store (works without backend)
        const foundProduct = products.find(p => p.id.toString() === id);

        if (foundProduct) {
            setProduct(foundProduct);

            // Initialize selected variations with first option
            if (foundProduct.variaciones) {
                const initial: Record<string, string> = {};
                foundProduct.variaciones.forEach((v: any) => {
                    if (v.opciones.length > 0) {
                        initial[v.tipo] = v.opciones[0].valor;
                    }
                });
                setSelectedVariations(initial);
            }

            // Mock reviews for demo
            setReviews([
                {
                    id: '1',
                    productId: id,
                    usuario: 'María González',
                    rating: 5,
                    comentario: 'Excelente producto, muy buena calidad',
                    fecha: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                {
                    id: '2',
                    productId: id,
                    usuario: 'Carlos Pérez',
                    rating: 4,
                    comentario: 'Buen precio y rápida entrega',
                    fecha: new Date(Date.now() - 86400000 * 5).toISOString()
                }
            ]);
        }

        setLoading(false);
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Calculate extra price from variations
        let extraPrice = 0;
        if (product.variaciones) {
            product.variaciones.forEach((v: any) => {
                const selectedValue = selectedVariations[v.tipo];
                const option = v.opciones.find((o: any) => o.valor === selectedValue);
                if (option?.precioExtra) {
                    extraPrice += option.precioExtra;
                }
            });
        }

        addItem({
            ...product,
            precio: product.precio + extraPrice,
            selectedVariations,
            quantity: 0
        } as any, quantity);

        alert(`${quantity} ${product.nombre} agregado al carrito`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F6F6] pt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <Package className="w-12 h-12 text-gray-400 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#F6F6F6] pt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
                        <p className="text-gray-500 mb-6">El producto que buscas no existe o fue eliminado</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-uber-500 hover:bg-uber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver a la tienda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const images = product.imagenes && product.imagenes.length > 0
        ? product.imagenes
        : [product.imagen];

    const avgRating = product.rating || (reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0);

    return (
        <div className="min-h-screen bg-[#F6F6F6] pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la tienda
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Images */}
                    <div>
                        <ImageGallery images={images} productName={product.nombre} />
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            {product.marca && (
                                <p className="text-sm text-uber-500 font-semibold mb-1">{product.marca}</p>
                            )}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.nombre}</h1>

                            {/* Rating */}
                            {avgRating > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(avgRating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {avgRating.toFixed(1)} ({reviews.length} reseñas)
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold text-gray-900">{format(product.precio)}</span>
                                <span className="text-lg text-gray-500">/ unidad</span>
                            </div>
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700 font-medium">En stock ({product.stock} disponibles)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-red-700 font-medium">Agotado</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {product.descripcion && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg text-gray-900 mb-3">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.descripcion}</p>
                            </div>
                        )}

                        {/* Variations */}
                        {product.variaciones && product.variaciones.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg text-gray-900 mb-4">Opciones disponibles</h3>
                                <VariationSelector
                                    variaciones={product.variaciones}
                                    selectedVariations={selectedVariations}
                                    onChange={(tipo, valor) => setSelectedVariations(prev => ({ ...prev, [tipo]: valor }))}
                                />
                            </div>
                        )}

                        {/* Specifications */}
                        {product.especificaciones && Object.keys(product.especificaciones).length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg text-gray-900 mb-4">Especificaciones</h3>
                                <dl className="space-y-3">
                                    {Object.entries(product.especificaciones).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                            <dt className="text-gray-600 font-medium">{key}</dt>
                                            <dd className="font-semibold text-gray-900">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        {/* Add to Cart - Sticky */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-4 mb-4">
                                <label className="text-sm font-semibold text-gray-700">Cantidad:</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-uber-500 hover:text-uber-500 font-bold transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-uber-500 hover:text-uber-500 font-bold transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-uber-500 hover:bg-uber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Agregar al carrito
                                </button>
                                <button className="p-4 border-2 border-gray-200 hover:border-uber-500 hover:text-uber-500 rounded-xl transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas de clientes</h2>
                    <ProductReviews
                        productId={product.id.toString()}
                        reviews={reviews}
                        rating={avgRating}
                        totalReviews={reviews.length}
                        onReviewAdded={loadProduct}
                    />
                </div>
            </div>
        </div>
    );
};
