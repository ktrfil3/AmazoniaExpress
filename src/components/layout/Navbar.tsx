import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Globe, DollarSign, User, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore, type Language } from '../../store/useLanguageStore';
import { useCurrencyStore, type Currency } from '../../store/useCurrencyStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ThemeToggle } from '../client/ThemeToggle';
import logo from '../../assets/logo.png';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { getTotalItems } = useCartStore();
    const { user, logout } = useAuthStore();
    const { language, setLanguage, t } = useLanguageStore();
    const { currency, setCurrency } = useCurrencyStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currencies: { code: Currency; label: string }[] = [
        { code: 'USD', label: 'USD ($)' },
        { code: 'BRL', label: 'BRL (R$)' },
        { code: 'VES', label: 'VES (Bs)' }
    ];

    const languages: { code: Language; label: string }[] = [
        { code: 'es', label: 'Español' },
        { code: 'pt', label: 'Português' }
    ];

    return (
        <nav className="bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 bg-black p-1 rounded-lg group-hover:bg-uber-500 transition-colors flex items-center justify-center">
                            <img src={logo} alt="AE Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100 hidden sm:block">
                            Amazonia Express
                        </span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Globe className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700 uppercase">{language}</span>
                            </button>
                            {showLangMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-uber-lg border border-gray-100 py-1 z-50">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setShowLangMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code ? 'bg-uber-50 text-uber-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Currency */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <DollarSign className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700 uppercase">{currency}</span>
                            </button>
                            {showCurrencyMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-uber-lg border border-gray-100 py-1 z-50">
                                    {currencies.map(curr => (
                                        <button
                                            key={curr.code}
                                            onClick={() => {
                                                setCurrency(curr.code);
                                                setShowCurrencyMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${currency === curr.code ? 'bg-uber-50 text-uber-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {curr.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <div className="bg-uber-100 dark:bg-uber-900/30 p-1.5 rounded-full">
                                        <User className="w-4 h-4 text-uber-600 dark:text-uber-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hidden md:block">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden md:block" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-uber-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                Mi Perfil
                                            </Link>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-uber-500 dark:hover:text-uber-400 transition-colors">
                                {t('login')}
                            </Link>
                        )}

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-uber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="relative p-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-uber-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <div className="px-4 py-4 space-y-4">
                        {/* User Info */}
                        {user && (
                            <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-uber-100 dark:bg-uber-900/30 p-2 rounded-full">
                                        <User className="w-5 h-5 text-uber-600 dark:text-uber-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Usuario</p>
                                    </div>
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Mi Perfil</span>
                                </Link>
                            </div>
                        )}

                        {/* Theme Selector */}
                        <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Tema</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => {
                                        useThemeStore.getState().setTheme('light');
                                    }}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${useThemeStore.getState().theme === 'light'
                                        ? 'border-uber-500 bg-uber-50 dark:bg-uber-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <Sun className="w-5 h-5" />
                                    <span className="text-xs font-medium">Claro</span>
                                </button>
                                <button
                                    onClick={() => {
                                        useThemeStore.getState().setTheme('dark');
                                    }}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${useThemeStore.getState().theme === 'dark'
                                        ? 'border-uber-500 bg-uber-50 dark:bg-uber-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <Moon className="w-5 h-5" />
                                    <span className="text-xs font-medium">Oscuro</span>
                                </button>
                                <button
                                    onClick={() => {
                                        useThemeStore.getState().setTheme('system');
                                    }}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${useThemeStore.getState().theme === 'system'
                                        ? 'border-uber-500 bg-uber-50 dark:bg-uber-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <Monitor className="w-5 h-5" />
                                    <span className="text-xs font-medium">Sistema</span>
                                </button>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-1">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                🏠 Inicio
                            </Link>
                            <Link
                                to="/cart"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                🛒 Carrito {getTotalItems() > 0 && `(${getTotalItems()})`}
                            </Link>
                        </div>

                        {/* Logout */}
                        {user && (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
