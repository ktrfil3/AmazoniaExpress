import { useSalesStore } from '../../store/useSalesStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { TrendingUp, DollarSign, ShoppingCart, Calendar, Zap } from 'lucide-react';

export const SalesDashboard = () => {
    const { getStats, getTopProducts, getSalesByPeriod, generateMockSales, sales } = useSalesStore();
    const { format } = useCurrencyStore();

    const stats = getStats();
    const topProducts = getTopProducts(5);
    const last7Days = getSalesByPeriod(7);

    // Group sales by day for chart
    const salesByDay = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const daySales = last7Days.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= dayStart && saleDate < dayEnd;
        });

        return {
            day: date.toLocaleDateString('es', { weekday: 'short' }),
            total: daySales.reduce((sum, s) => sum + s.total, 0),
        };
    });

    const maxSale = Math.max(...salesByDay.map(d => d.total), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard de Ventas</h2>
                    <p className="text-gray-500 text-sm mt-1">Resumen de rendimiento y estadísticas</p>
                </div>
                {sales.length === 0 && (
                    <button
                        onClick={generateMockSales}
                        className="flex items-center gap-2 bg-uber-500 hover:bg-uber-600 text-white px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                        <Zap className="w-4 h-4" />
                        Generar Datos Demo
                    </button>
                )}
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
                    <p className="text-2xl font-bold text-gray-900">{format(stats.today)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ventas del día</p>
                </div>

                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Este Mes</span>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{format(stats.thisMonth)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ingresos mensuales</p>
                </div>

                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Este Año</span>
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{format(stats.thisYear)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ingresos anuales</p>
                </div>

                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total</span>
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <ShoppingCart className="w-4 h-4 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Transacciones</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Últimos 7 Días</h3>
                    <div className="space-y-3">
                        {salesByDay.map((day, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500 w-12">{day.day}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-uber-400 to-uber-600 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                                        style={{ width: `${(day.total / maxSale) * 100}%` }}
                                    >
                                        {day.total > 0 && (
                                            <span className="text-xs font-bold text-white">{format(day.total)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Productos</h3>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">
                            {topProducts.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-uber-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-uber-700">#{i + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{item.product.nombre}</p>
                                        <p className="text-xs text-gray-500">{item.totalSold} unidades vendidas</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{format(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay datos de ventas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
