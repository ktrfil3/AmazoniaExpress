import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/client/ProductCard';

export const FavoritesPage = () => {
    const { favorites } = useFavoritesStore();
    const { products } = useProductStore();

    // Filter products that are in the favorites list
    const favoriteProducts = products.filter(product => favorites.includes(product.id));

    return (
        <div className="min-h-screen bg-[#F6F6F6] pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500 fill-current" />
                            Mis Favoritos
                        </h1>
                        <p className="text-gray-500">
                            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
                        </p>
                    </div>
                </div>

                {/* Content */}
                {favoriteProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {favoriteProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes favoritos aún</h2>
                        <p className="text-gray-500 mb-8 max-w-md text-center">
                            Guarda los productos que más te gusten picando en el corazón para encontrarlos fácilmente aquí.
                        </p>
                        <Link
                            to="/"
                            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                            Explorar Productos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
