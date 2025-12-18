import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { ShoppingBag, ArrowRight, X } from 'lucide-react';
import { CheckoutForm } from './CheckoutForm';

export const BottomCart = () => {
    const { items, getTotalPrice, getTotalItems } = useCartStore();
    const { format } = useCurrencyStore();
    const { t } = useLanguageStore();
    const [showCheckout, setShowCheckout] = useState(false);

    if (items.length === 0) return null;

    return (
        <>
            {/* Bottom Cart Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-uber-lg z-40 md:hidden">
                <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full px-4 py-4 flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-uber-500 text-white rounded-full p-2">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-900">
                                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                            </p>
                            <p className="text-xs text-gray-500">{t('cart.title')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{format(getTotalPrice())}</span>
                        <ArrowRight className="w-5 h-5 text-uber-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>

            {/* Mobile Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setShowCheckout(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                            <h2 className="text-xl font-bold text-gray-900">{t('cart.title')}</h2>
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Checkout Form */}
                        <div className="p-6 pb-8">
                            <CheckoutForm />
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </>
    );
};
