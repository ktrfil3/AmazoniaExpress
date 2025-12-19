import { useState, useMemo } from 'react';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/client/ProductCard';
import { CheckoutForm } from '../components/client/CheckoutForm';
import { BottomCart } from '../components/client/BottomCart';
import {
    Filter, Search,
    ShoppingBag, Hammer, Utensils, Paperclip,
    Monitor, Heart, Dog, Pill
} from 'lucide-react';
import type { Department } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';
import { Footer } from '../components/layout/Footer';
import { NewsSection } from '../components/client/NewsSection';

const departmentIcons: Record<string, any> = {
    'Víveres': ShoppingBag,
    'Ferretería': Hammer,
    'Charcutería y Carnicería': Utensils,
    'Quincallería': Paperclip,
    'Electrodomésticos': Monitor,
    'Maquillaje y Cuidado Personal': Heart,
    'Mascotas': Dog,
    'Farmacia': Pill
};

// Derived dynamically
// const departments: Department[] = [ ... ];

export const ClientView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Department | 'Todos'>('Todos');
    const { t } = useLanguageStore();
    const { products, isLoading, error } = useProductStore();

    // Dynamically extract categories from available products
    const departments = useMemo(() => {
        const uniqueCats = Array.from(new Set(products.map(p => p.categoria)));
        // Optional: Sort them
        return uniqueCats.sort();
    }, [products]);

    const ITEMS_PER_PAGE = 16;
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (

        <div className="min-h-screen bg-[#F6F6F6] dark:bg-gray-900 flex flex-col transition-colors duration-200">
            <div className="flex-grow pb-32 md:pb-20">
                {/* Hero with Product Search */}
                <div className="bg-white dark:bg-gray-800 pt-6 pb-8 mb-6 shadow-sm dark:shadow-gray-900/40 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            {t('hero.title')} <span className="text-uber-500">{t('hero.subtitle')}</span>
                        </h1>
                        <p className="text-gray-800 dark:text-gray-200 mb-6 md:text-2xl font-bold ">{t('hero.description')}</p>

                        {/* Product Search Bar */}
                        <div className="relative max-w-2xl bg-gray-100 dark:bg-gray-700 rounded-full flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
                            <Search className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Buscar productos (ej. Arroz, Leche, Harina...)"
                                className="bg-transparent border-none outline-none w-full text-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Horizontal Scrolling Categories */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('categories.title')}</h2>
                        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-uber -mx-4 px-4">
                            <button
                                onClick={() => setSelectedCategory('Todos')}
                                className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all min-w-[5.5rem] ${selectedCategory === 'Todos' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${selectedCategory === 'Todos' ? 'bg-uber-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-uber dark:shadow-gray-900/50'}`}>
                                    <ShoppingBag size={24} />
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Todos</span>
                            </button>
                            {departments.map((dept) => {
                                const Icon = departmentIcons[dept] || ShoppingBag;
                                const isSelected = selectedCategory === dept;
                                const shortName = dept === 'Maquillaje y Cuidado Personal' ? 'Cuidado' :
                                    dept === 'Charcutería y Carnicería' ? 'Carnes' : dept;

                                return (
                                    <button
                                        key={dept}
                                        onClick={() => setSelectedCategory(dept)}
                                        className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all min-w-[5.5rem] ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-uber-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-uber dark:shadow-gray-900/50'}`}>
                                            <Icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 max-w-[80px] text-center leading-tight">
                                            {shortName}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Product Feed */}
                        <div className="lg:col-span-8">
                            {isLoading && (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uber-500"></div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="font-bold">Error cargando productos</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {!isLoading && !error && (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {selectedCategory === 'Todos' ? t('products.all') : selectedCategory}
                                        </h2>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Mostrando {currentProducts.length} de {filteredProducts.length} productos
                                        </span>
                                    </div>

                                    {filteredProducts.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                {currentProducts.map(product => (
                                                    <ProductCard key={product.id} product={product} />
                                                ))}
                                            </div>

                                            {/* Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="flex justify-center items-center gap-2 mt-8">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        ←
                                                    </button>

                                                    {/* Page Numbers */}
                                                    <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none scrollbar-hide">
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                            .filter(p => p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2))
                                                            .map((page, index, array) => (
                                                                <>
                                                                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 self-center text-gray-400">...</span>}
                                                                    <button
                                                                        key={page}
                                                                        onClick={() => handlePageChange(page)}
                                                                        className={`w-8 h-8 rounded-full font-medium transition-all ${currentPage === page
                                                                            ? 'bg-uber-500 text-white shadow-md transform scale-110'
                                                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                            }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                </>
                                                            ))}
                                                    </div>

                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        →
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-uber border border-gray-100 dark:border-gray-700">
                                            <Filter className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('products.noResults')}</p>
                                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos') }} className="mt-4 text-uber-500 hover:text-uber-600 font-medium">
                                                {t('products.clearFilters')}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Desktop Checkout Sidebar */}
                        <div id="cart-section" className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-uber dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">{t('cart.title')}</h2>
                                </div>
                                <div className="p-6">
                                    <CheckoutForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News & Blog Section */}
                <div className="mt-24 border-t border-gray-200 dark:border-gray-700">
                    <NewsSection />
                </div>
            </div>

            {/* Mobile Bottom Cart */}
            <BottomCart />

            {/* Footer */}
            <Footer />
        </div>
    );
};

