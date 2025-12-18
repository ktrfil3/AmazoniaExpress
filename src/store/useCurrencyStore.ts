import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'USD' | 'BRL' | 'VES';

interface CurrencyRates {
    USD: number;
    BRL: number;
    VES: number;
}

interface CurrencyState {
    currency: Currency;
    rates: CurrencyRates;
    setCurrency: (currency: Currency) => void;
    updateRates: (rates: Partial<CurrencyRates>) => void;
    convert: (amount: number) => number;
    format: (amount: number) => string;
}

const DEFAULT_RATES: CurrencyRates = {
    BRL: 1,      // Base currency (Real Brasileño)
    USD: 0.20,   // 1 BRL = 0.20 USD (aprox 5 BRL = 1 USD)
    VES: 7.30    // 1 BRL = 7.30 VES
};

const SYMBOLS: Record<Currency, string> = {
    USD: '$',
    BRL: 'R$',
    VES: 'Bs'
};

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            currency: 'BRL', // Default to BRL
            rates: DEFAULT_RATES,

            setCurrency: (currency) => set({ currency }),

            updateRates: (newRates) => set((state) => ({
                rates: { ...state.rates, ...newRates }
            })),

            convert: (amount) => {
                const { currency, rates } = get();
                return amount * rates[currency];
            },

            format: (amount) => {
                const { currency } = get();
                const converted = get().convert(amount);
                const symbol = SYMBOLS[currency];
                return `${symbol}${converted.toFixed(2)}`;
            }
        }),
        {
            name: 'currency-storage'
        }
    )
);
