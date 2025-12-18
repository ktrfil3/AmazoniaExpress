import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({ user: { ...user, isAuthenticated: true } }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'auth-storage'
        }
    )
);
