import { useState, useMemo } from 'react';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/client/ProductCard';
import { CheckoutForm } from '../components/client/CheckoutForm';
import { LocationInput } from '../components/client/LocationInput';
import { BottomCart } from '../components/client/BottomCart';
import {
    Filter,
    ShoppingBag, Hammer, Utensils, Paperclip,
    Monitor, Heart, Dog, Pill
} from 'lucide-react';
import type { Department } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';

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

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#F6F6F6] pb-32 md:pb-20">
            {/* Hero with Location */}
            <div className="bg-white pt-6 pb-8 mb-6 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-7xl font-bold text-gray-900 mb-6">
                        {t('hero.title')} <span className="text-uber-500">{t('hero.subtitle')}</span>
                    </h1>
                    <p className="text-gray-800 mb-6 md:text-2xl font-bold ">{t('hero.description')}</p>
                    <LocationInput />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Horizontal Scrolling Categories */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{t('categories.title')}</h2>
                    <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                        <button
                            onClick={() => setSelectedCategory('Todos')}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all min-w-[5.5rem] ${selectedCategory === 'Todos' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${selectedCategory === 'Todos' ? 'bg-uber-500 text-white' : 'bg-white text-gray-600 shadow-uber'}`}>
                                <ShoppingBag size={24} />
                            </div>
                            <span className="text-xs font-medium text-gray-900">Todos</span>
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
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-uber-500 text-white' : 'bg-white text-gray-600 shadow-uber'}`}>
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-900 max-w-[80px] text-center leading-tight">
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
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                                <div className="flex-1">
                                    <p className="font-bold">Error cargando productos</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {!isLoading && !error && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedCategory === 'Todos' ? t('products.all') : selectedCategory}
                                    </h2>
                                    <span className="text-sm text-gray-500">{filteredProducts.length} {t('products.items')}</span>
                                </div>

                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-2xl shadow-uber">
                                        <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-lg">{t('products.noResults')}</p>
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
                        <div className="bg-white rounded-2xl shadow-uber border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="font-bold text-xl text-gray-900">{t('cart.title')}</h2>
                            </div>
                            <div className="p-6">
                                <CheckoutForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Cart */}
            <BottomCart />
        </div>
    );
};
