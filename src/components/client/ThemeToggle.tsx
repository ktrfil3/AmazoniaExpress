import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, type Theme } from '../../store/useThemeStore';

export const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();
    const [showMenu, setShowMenu] = useState(false);

    const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
        { value: 'light', label: 'Claro', icon: Sun },
        { value: 'dark', label: 'Oscuro', icon: Moon },
        { value: 'system', label: 'Sistema', icon: Monitor }
    ];

    const currentTheme = themes.find(t => t.value === theme) || themes[2];
    const Icon = currentTheme.icon;

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Cambiar tema"
            >
                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-uber-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
                        {themes.map((t) => {
                            const ThemeIcon = t.icon;
                            return (
                                <button
                                    key={t.value}
                                    onClick={() => {
                                        setTheme(t.value);
                                        setShowMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${theme === t.value
                                            ? 'bg-uber-50 dark:bg-uber-900/20 text-uber-700 dark:text-uber-400 font-semibold'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <ThemeIcon className="w-4 h-4" />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};
