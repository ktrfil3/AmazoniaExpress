import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, Save, ArrowLeft } from 'lucide-react';
import { useProfileStore, type UserProfile } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';

export const ProfilePage = () => {
    const { profile, updateProfile } = useProfileStore();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState<UserProfile>({
        name: profile?.name || user?.name || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        address: {
            street: profile?.address.street || '',
            city: profile?.address.city || 'Santa Elena de Uairén',
            state: profile?.address.state || 'Bolívar',
            zipCode: profile?.address.zipCode || '',
            reference: profile?.address.reference || ''
        },
        preferences: {
            saveInfo: profile?.preferences.saveInfo ?? true
        }
    });

    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChange = (field: string, value: any) => {
        if (field.startsWith('address.')) {
            const addressField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mi Perfil</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gestiona tu información personal y preferencias</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-uber-100 dark:bg-uber-900/30 p-2 rounded-lg">
                                <User className="w-5 h-5 text-uber-600 dark:text-uber-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Información Personal</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none transition-colors"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Teléfono *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none transition-colors"
                                        placeholder="+58 424 123 4567"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email (opcional)
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none transition-colors"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-uber-100 dark:bg-uber-900/30 p-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-uber-600 dark:text-uber-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dirección de Entrega</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Calle / Avenida *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address.street}
                                    onChange={(e) => handleChange('address.street', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none transition-colors"
                                    placeholder="Av. Principal, Casa #123"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Ciudad *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address.city}
                                        onChange={(e) => handleChange('address.city', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Estado *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address.state}
                                        onChange={(e) => handleChange('address.state', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Punto de Referencia (opcional)
                                </label>
                                <textarea
                                    value={formData.address.reference}
                                    onChange={(e) => handleChange('address.reference', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-uber-500 dark:focus:border-uber-400 rounded-xl outline-none resize-none transition-colors"
                                    placeholder="Ej: Cerca del supermercado, edificio azul..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {saved && (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Información guardada
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-uber-500 hover:bg-uber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>💡 Tip:</strong> Tu información se guardará de forma segura y se usará para auto-completar tus pedidos futuros.
                    </p>
                </div>
            </div>
        </div>
    );
};
