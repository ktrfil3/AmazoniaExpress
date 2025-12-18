import { useState } from 'react';
import { SalesDashboard } from '../components/admin/SalesDashboard';
import { InventoryManager } from '../components/admin/InventoryManager';
import { DataImporter } from '../components/admin/DataImporter';
import { CurrencyManager } from '../components/admin/CurrencyManager';
import { BarChart3, Package, Settings, Upload } from 'lucide-react';

type Tab = 'dashboard' | 'inventory' | 'settings';

export const AdminView = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const tabs = [
        { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
        { id: 'inventory' as Tab, label: 'Inventario', icon: Package },
        { id: 'settings' as Tab, label: 'Configuración', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#F6F6F6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                    <p className="text-gray-500 mt-1">Amazonia Express - Santa Elena de Uairén</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-uber border border-gray-100 mb-6">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-uber-500 text-uber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="pb-8">
                    {activeTab === 'dashboard' && <SalesDashboard />}
                    {activeTab === 'inventory' && <InventoryManager />}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <CurrencyManager />
                            <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <Upload className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Importar Productos</h2>
                                        <p className="text-sm text-gray-500">Carga masiva desde archivo Excel</p>
                                    </div>
                                </div>
                                <DataImporter />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
