import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
    username: string;
    role: 'superadmin' | 'admin';
}

interface AdminAuthState {
    currentAdmin: AdminUser | null;
    registeredAdmins: { username: string; password: string }[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    addAdmin: (username: string, password: string) => boolean;
    removeAdmin: (username: string) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
    persist(
        (set, get) => ({
            currentAdmin: null,
            registeredAdmins: [], // Stores created admins

            login: (username, password) => {
                // 1. Check Super Admin Hardcoded
                if (username === 'MaGonzalo' && password === 'Mg901952') {
                    set({ currentAdmin: { username, role: 'superadmin' } });
                    return true;
                }

                // 2. Check Registered Admins
                const found = get().registeredAdmins.find(
                    (a) => a.username === username && a.password === password
                );
                if (found) {
                    set({ currentAdmin: { username, role: 'admin' } });
                    return true;
                }

                return false;
            },

            logout: () => set({ currentAdmin: null }),

            addAdmin: (username, password) => {
                const { registeredAdmins, currentAdmin } = get();

                // Only Super Admin can add
                if (currentAdmin?.role !== 'superadmin') return false;

                // Check duplicates (including super admin name)
                if (username === 'MaGonzalo' || registeredAdmins.some(a => a.username === username)) {
                    return false;
                }

                set({ registeredAdmins: [...registeredAdmins, { username, password }] });
                return true;
            },

            removeAdmin: (username) => {
                const { registeredAdmins, currentAdmin } = get();
                if (currentAdmin?.role !== 'superadmin') return;

                set({ registeredAdmins: registeredAdmins.filter(a => a.username !== username) });
            }
        }),
        {
            name: 'admin-auth-storage', // separate from customer auth
            partialize: (state) => ({ registeredAdmins: state.registeredAdmins }), // Only persist the list of admins, session is volatile? Actually better persist session too for reload.
            // Let's persist everything for convenience so reload keeps login
        }
    )
);
