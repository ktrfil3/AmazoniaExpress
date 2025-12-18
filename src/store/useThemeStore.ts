import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    getEffectiveTheme: () => EffectiveTheme;
}

const getSystemTheme = (): EffectiveTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'system',

            setTheme: (theme: Theme) => {
                set({ theme });
                applyTheme(theme);
            },

            getEffectiveTheme: () => {
                const { theme } = get();
                return theme === 'system' ? getSystemTheme() : theme;
            }
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyTheme(state.theme);
                }
            }
        }
    )
);

const applyTheme = (theme: Theme) => {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

    if (effectiveTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

// Listen for system theme changes
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const store = useThemeStore.getState();
        if (store.theme === 'system') {
            applyTheme('system');
        }
    });

    // Apply theme on initial load
    const initialTheme = useThemeStore.getState().theme;
    applyTheme(initialTheme);
}
