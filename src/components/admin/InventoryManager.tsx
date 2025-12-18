import { useState, useMemo } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import type { Department } from '../../types';
import { Search, Package, AlertTriangle, Edit2, Check, X } from 'lucide-react';

export const InventoryManager = () => {
    const { products, setProducts } = useProductStore();
    const { format } = useCurrencyStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Department | 'Todos'>('Todos');
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [editStock, setEditStock] = useState(0);
    const [editPrice, setEditPrice] = useState(0);

    const categories: (Department | 'Todos')[] = [
        'Todos', 'Víveres', 'Ferretería', 'Charcutería y Carnicería', 'Quincallería',
        'Electrodomésticos', 'Maquillaje y Cuidado Personal', 'Mascotas', 'Farmacia'
    ];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'Todos' || p.categoria === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);

    const lowStockProducts = products.filter(p => p.stock < 10);

    const startEdit = (product: typeof products[0]) => {
        setEditingId(product.id);
        setEditStock(product.stock);
        setEditPrice(product.precio);
    };

    const saveEdit = () => {
        if (editingId === null) return;

        const updatedProducts = products.map(p =>
            p.id === editingId ? { ...p, stock: editStock, precio: editPrice } : p
        );
        setProducts(updatedProducts);
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h2>
                <p className="text-gray-500 text-sm mt-1">Administra stock y precios de productos</p>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-orange-900">
                            {lowStockProducts.length} producto(s) con stock bajo
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                            {lowStockProducts.map(p => p.nombre).join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl outline-none transition-all"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as Department | 'Todos')}
                        className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-uber border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-900">{product.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{product.categoria}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === product.id ? (
                                            <input
                                                type="number"
                                                value={editStock}
                                                onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                                className="w-20 px-2 py-1 border-2 border-uber-500 rounded-lg text-sm font-semibold outline-none"
                                            />
                                        ) : (
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                <Package className="w-3 h-3" />
                                                {product.stock}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === product.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editPrice}
                                                onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                                className="w-24 px-2 py-1 border-2 border-uber-500 rounded-lg text-sm font-semibold outline-none"
                                            />
                                        ) : (
                                            <span className="font-semibold text-gray-900">{format(product.precio)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === product.id ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={saveEdit}
                                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(product)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                            >
                                                <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-uber-500" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No se encontraron productos</p>
                    </div>
                )}
            </div>
        </div>
    );
};
