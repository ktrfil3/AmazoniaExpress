import { useState, useEffect } from 'react';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useProductStore } from '../../store/useProductStore';
import { analyticsService } from '../../services/analyticsService';
import { reviewService } from '../../services/reviewService';
import { TrendingUp, DollarSign, ShoppingCart, Calendar, RotateCw, Trash2, Star, ArrowDown } from 'lucide-react';

export const SalesDashboard = () => {
    const { format } = useCurrencyStore();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<{
        totalRevenue: number;
        totalTransactions: number;
        todaySales: number;
        monthSales: number;
        yearSales: number;
        topProducts: { name: string; quantity: number; revenue: number }[];
    }>({
        totalRevenue: 0,
        totalTransactions: 0,
        todaySales: 0,
        monthSales: 0,
        yearSales: 0,
        topProducts: []
    });

    const { products } = useProductStore();
    const [reviewStats, setReviewStats] = useState<{
        topRated: any[];
        bottomRated: any[];
    }>({ topRated: [], bottomRated: [] });

    useEffect(() => {
        loadData();
    }, [products]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [metricsData, reviewsData] = await Promise.all([
                analyticsService.getMetrics(),
                reviewService.getReviewStats(products)
            ]);
            setMetrics(metricsData);
            setReviewStats(reviewsData);
        } catch (error) {
            console.error('Error loading metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('¿Estás seguro de BORRAR TODAS las estadísticas? Esta acción no se puede deshacer.')) {
            await analyticsService.resetSales();
            loadData();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Estadísticas Reales</h2>
                    <p className="text-gray-500 text-sm mt-1">Datos obtenidos de checkout en WhatsApp</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                        <RotateCw className="w-4 h-4" />
                        Actualizar
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold transition-all"
                        title="Borrar todas las ventas"
                    >
                        <Trash2 className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Hoy</span>
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{format(metrics.todaySales)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ventas del día</p>
                </div>

                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Este Mes</span>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{format(metrics.monthSales)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ingresos mensuales</p>
                </div>

                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Este Año</span>
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{format(metrics.yearSales)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ingresos anuales</p>
                </div>

                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total</span>
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <ShoppingCart className="w-4 h-4 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalTransactions}</p>
                    <p className="text-xs text-gray-400 mt-1">Transacciones históricas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Productos Más Vendidos</h3>
                    {metrics.topProducts.length > 0 ? (
                        <div className="space-y-3">
                            {metrics.topProducts.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-uber-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-uber-700">#{i + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} unidades vendidas</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{format(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Aún no hay ventas registradas</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reputation Section */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    Reputación de Productos
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Rated */}
                    <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                        <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Top 10 Mejor Valorados
                        </h4>
                        <div className="space-y-3">
                            {reviewStats.topRated.map((product, i) => (
                                <div key={product.id} className="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                    <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            {product.averageRating.toFixed(1)} ({product.count} reseñas)
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reviewStats.topRated.length === 0 && (
                                <p className="text-sm text-gray-400 italic text-center py-4">Sin suficientes datos</p>
                            )}
                        </div>
                    </div>

                    {/* Bottom Rated */}
                    <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                        <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                            <ArrowDown className="w-5 h-5" />
                            Top 10 Peor Valorados
                        </h4>
                        <div className="space-y-3">
                            {reviewStats.bottomRated.map((product, i) => (
                                <div key={product.id} className="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                    <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Star className="w-3 h-3 text-gray-300" />
                                            {product.averageRating.toFixed(1)} ({product.count} reseñas)
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reviewStats.bottomRated.length === 0 && (
                                <p className="text-sm text-gray-400 italic text-center py-4">Sin suficientes datos</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
