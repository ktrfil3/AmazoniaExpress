import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
    favorites: (string | number)[];
    addFavorite: (id: string | number) => void;
    removeFavorite: (id: string | number) => void;
    isFavorite: (id: string | number) => boolean;
    toggleFavorite: (id: string | number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (id) => set((state) => ({ favorites: [...state.favorites, id] })),
            removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((fav) => fav !== id) })),
            isFavorite: (id) => get().favorites.includes(id),
            toggleFavorite: (id) => {
                const { favorites } = get();
                if (favorites.includes(id)) {
                    set({ favorites: favorites.filter((fav) => fav !== id) });
                } else {
                    set({ favorites: [...favorites, id] });
                }
            },
        }),
        {
            name: 'favorites-storage',
        }
    )
);
