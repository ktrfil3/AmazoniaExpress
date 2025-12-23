import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import { analyticsService } from '../services/analyticsService';

interface CartState {
    items: CartItem[];
    addToCart: (product: Product) => void;
    addItem: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number; // Total with shipping
    getSubtotal: () => number; // Items total
    getTotalItems: () => number;
    shippingAddress: string;
    shippingCost: number;
    setShippingAddress: (address: string) => void;
    checkout: (customerdata: { name: string; phone: string; paymentMethod: string }) => void;
    // Delivery Configuration
    deliveryConfig: {
        gasPrice: number;
        storeLocation: { lat: number; lng: number };
    };
    updateDeliveryConfig: (config: Partial<{ gasPrice: number; storeLocation: { lat: number; lng: number } }>) => void;
    deliveryInfo: {
        distance: number;
        vehicle: string;
        cost: number;
        finalPrice?: number;
        requiresQuote?: boolean;
    } | null;
    setDeliveryInfo: (info: { distance: number; vehicle: string; cost: number; finalPrice?: number; requiresQuote?: boolean } | null) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map(item =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            )
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                });
            },

            addItem: (product, quantity) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map(item =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            )
                        };
                    }
                    return { items: [...state.items, { ...product, quantity }] };
                });
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== productId)
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(item => item.id !== productId)
                        };
                    }
                    return {
                        items: state.items.map(item =>
                            item.id === productId ? { ...item, quantity } : item
                        )
                    };
                });
            },

            clearCart: () => set({ items: [] }),

            getSubtotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + (item.precio * item.quantity), 0);
            },

            getTotalPrice: () => {
                const { getSubtotal, shippingCost } = get();
                return getSubtotal() + shippingCost;
            },

            getTotalItems: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.quantity, 0);
            },

            shippingAddress: '',
            shippingCost: 0,

            setShippingAddress: (address) => {
                const isSantaElena = address.toLowerCase().includes('santa elena');
                set({
                    shippingAddress: address,
                    shippingCost: isSantaElena ? 5 : 0 // Default logic
                });
            },

            checkout: (customerData) => {
                const { items, getTotalPrice } = get();
                analyticsService.recordSale({
                    items,
                    total: getTotalPrice(),
                    customerName: customerData.name,
                    customerPhone: customerData.phone,
                    paymentMethod: customerData.paymentMethod
                });
            },

            // Delivery State
            deliveryConfig: {
                gasPrice: 7.8, // Default user provided
                storeLocation: { lat: 4.60226, lng: -61.11025 } // HVXR+53V Santa Elena de Uairén
            },

            updateDeliveryConfig: (newConfig) => {
                set((state) => ({
                    deliveryConfig: { ...state.deliveryConfig, ...newConfig }
                }));
            },

            deliveryInfo: null,

            setDeliveryInfo: (info) => {
                set({
                    deliveryInfo: info,
                    shippingCost: info ? (info.finalPrice || info.cost) : 0
                });
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
