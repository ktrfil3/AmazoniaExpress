import { useState } from 'react';
import { SalesDashboard } from '../components/admin/SalesDashboard';
import { InventoryManager } from '../components/admin/InventoryManager';
import { DataImporter } from '../components/admin/DataImporter';
import { CurrencyManager } from '../components/admin/CurrencyManager';
import { BarChart3, Package, Settings, Upload, UserPlus, Shield, Trash2 } from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';

// Sub-component for Admin Management
const AdminManagementSection = () => {
    const { currentAdmin, addAdmin, removeAdmin, registeredAdmins } = useAdminAuthStore();
    const [newAdminUser, setNewAdminUser] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [msg, setMsg] = useState('');

    if (currentAdmin?.role !== 'superadmin') return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const success = addAdmin(newAdminUser, newAdminPass);
        if (success) {
            setMsg('Administrador creado con éxito');
            setNewAdminUser('');
            setNewAdminPass('');
        } else {
            setMsg('Error: Usuario duplicado o datos inválidos');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-uber border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Gestión de Administradores</h2>
                    <p className="text-sm text-gray-500">Solo visible para Super Administrador</p>
                </div>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Nuevo Usuario"
                    value={newAdminUser}
                    onChange={e => setNewAdminUser(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={newAdminPass}
                    onChange={e => setNewAdminPass(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    required
                />
                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <UserPlus size={18} /> Crear
                </button>
            </form>
            {msg && <p className="text-sm mb-4 font-medium text-purple-600">{msg}</p>}

            {/* List of admins */}
            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Administradores registrados:</h3>
                {registeredAdmins.length === 0 ? (
                    <p className="text-gray-400 italic">No hay otros administradores.</p>
                ) : (
                    <ul className="space-y-2">
                        {registeredAdmins.map((admin, idx) => (
                            <li key={idx} className="flex items-center justify-between text-gray-700 bg-gray-50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    {admin.username}
                                </div>
                                <button
                                    onClick={() => removeAdmin(admin.username)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                    title="Eliminar usuario"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

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

                            {/* Admin Management - Only for Super Admin */}
                            <AdminManagementSection />

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
