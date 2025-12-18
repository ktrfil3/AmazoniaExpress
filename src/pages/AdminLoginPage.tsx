import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { ShieldCheck, Lock } from 'lucide-react';

export const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAdminAuthStore(state => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-uber-500 rounded-xl mb-4 text-white">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Panel Administrativo</h1>
                    <p className="text-gray-400">Acceso restringido</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-uber-500 focus:border-transparent transition-all outline-none"
                            placeholder="Usuario administrador"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-uber-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute right-4 top-3.5 text-gray-500" size={20} />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-uber-500 hover:bg-uber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg hover:shadow-uber-500/25"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};
