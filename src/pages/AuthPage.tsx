import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import logo from '../assets/logo.png';

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    return (
        <div className="min-h-screen bg-gradient-to-br from-uber-50 via-white to-uber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-black dark:bg-uber-500 rounded-2xl mb-4 p-4">
                        <img src={logo} alt="Amazonia Express Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Amazonia Express
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tu supermercado en línea
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-uber-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'login'
                                ? 'text-uber-600 dark:text-uber-400 border-b-2 border-uber-500'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'signup'
                                ? 'text-uber-600 dark:text-uber-400 border-b-2 border-uber-500'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Forms */}
                    <div className="p-6">
                        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Al continuar, aceptas nuestros{' '}
                    <a href="#" className="text-uber-600 dark:text-uber-400 hover:underline">
                        Términos de Servicio
                    </a>{' '}
                    y{' '}
                    <a href="#" className="text-uber-600 dark:text-uber-400 hover:underline">
                        Política de Privacidad
                    </a>
                </p>
            </div>
        </div>
    );
};
