import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
    name: string;
    phone: string;
    email?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode?: string;
        reference?: string;
    };
    preferences: {
        saveInfo: boolean;
    };
}

interface ProfileState {
    profile: UserProfile | null;
    updateProfile: (profile: Partial<UserProfile>) => void;
    clearProfile: () => void;
    hasProfile: () => boolean;
}

const defaultProfile: UserProfile = {
    name: '',
    phone: '',
    email: '',
    address: {
        street: '',
        city: 'Santa Elena de Uairén',
        state: 'Bolívar',
        zipCode: '',
        reference: ''
    },
    preferences: {
        saveInfo: true
    }
};

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            profile: null,

            updateProfile: (updates: Partial<UserProfile>) => {
                set((state) => ({
                    profile: state.profile
                        ? { ...state.profile, ...updates }
                        : { ...defaultProfile, ...updates }
                }));
            },

            clearProfile: () => set({ profile: null }),

            hasProfile: () => {
                const { profile } = get();
                return !!(profile && profile.name && profile.phone && profile.address.street);
            }
        }),
        {
            name: 'user-profile-storage'
        }
    )
);
