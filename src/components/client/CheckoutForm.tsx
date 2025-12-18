import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { MapPin, Smartphone, Truck, Store, Clock } from 'lucide-react';
import { SwipeableCartItem } from './SwipeableCartItem';

interface CheckoutFormInputs {
    name: string;
    phone: string;
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
    reference?: string;
    coords?: string;
}

export const CheckoutForm = () => {
    const { items, getTotalPrice, getSubtotal, shippingCost, clearCart, removeFromCart } = useCartStore();
    const { user } = useAuthStore();
    const { format } = useCurrencyStore();
    const { t } = useLanguageStore();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormInputs>({
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            deliveryMethod: 'delivery'
        }
    });

    const [locationLoading, setLocationLoading] = useState(false);
    const deliveryMethod = watch('deliveryMethod');

    const getLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                    setValue('coords', coords);
                    setLocationLoading(false);
                },
                (error) => {
                    console.error(error);
                    alert('Error obtaining location.');
                    setLocationLoading(false);
                }
            );
        } else {
            alert('Geolocation not supported.');
            setLocationLoading(false);
        }
    };

    const onSubmit = (data: CheckoutFormInputs) => {
        let message = `*Pedido - Amazonia Express*\n\n`;
        message += `*Cliente:* ${data.name}\n`;
        message += `*Teléfono:* ${data.phone}\n`;
        message += `*Método:* ${data.deliveryMethod === 'delivery' ? 'Envío 🛵' : 'Retiro 🏪'}\n\n`;

        if (data.deliveryMethod === 'delivery') {
            message += `*Dirección:* ${data.address}\n`;
            message += `*Referencia:* ${data.reference || 'N/A'}\n`;
            if (data.coords) message += `*Ubicación:* https://maps.google.com/?q=${data.coords}\n`;
            message += `\n`;
        }

        message += `*Items:*\n`;
        items.forEach(item => {
            message += `- ${item.quantity}x ${item.nombre} (${format(item.precio * item.quantity)})\n`;
        });

        message += `\n*TOTAL: ${format(getTotalPrice())}*`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/584249317720?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        clearCart();
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="text-gray-300 w-10 h-10" />
                </div>
                <p className="text-gray-900 font-semibold text-lg mb-1">{t('cart.empty')}</p>
                <p className="text-gray-500 text-sm">{t('cart.addItems')}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Cart Items Summary */}
            <div className="space-y-3">
                {items.map(item => (
                    <SwipeableCartItem
                        key={`${item.id}-${Math.random()}`}
                        item={item}
                        onRemove={(id) => removeFromCart(id)}
                    />
                ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                    <div>
                        <input
                            {...register('name', { required: true })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                            placeholder={t('checkout.name')}
                        />
                        {errors.name && <span className="text-red-500 text-xs mt-1 block">{t('checkout.required')}</span>}
                    </div>

                    <div>
                        <input
                            {...register('phone', { required: true })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                            placeholder={t('checkout.phone')}
                        />
                        {errors.phone && <span className="text-red-500 text-xs mt-1 block">{t('checkout.required')}</span>}
                    </div>
                </div>
            </div>

            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{t('checkout.deliveryMethod')}</p>
                <div className="grid grid-cols-2 gap-3">
                    <label className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${deliveryMethod === 'delivery' ? 'border-uber-500 bg-uber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input {...register('deliveryMethod')} type="radio" value="delivery" className="hidden" />
                        <Truck className={`mb-2 w-6 h-6 ${deliveryMethod === 'delivery' ? 'text-uber-500' : 'text-gray-400'}`} />
                        <span className={`text-sm font-bold ${deliveryMethod === 'delivery' ? 'text-uber-700' : 'text-gray-700'}`}>{t('checkout.delivery')}</span>
                        <span className="text-xs text-gray-500 mt-1">20-30 min</span>
                    </label>
                    <label className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-uber-500 bg-uber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input {...register('deliveryMethod')} type="radio" value="pickup" className="hidden" />
                        <Store className={`mb-2 w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-uber-500' : 'text-gray-400'}`} />
                        <span className={`text-sm font-bold ${deliveryMethod === 'pickup' ? 'text-uber-700' : 'text-gray-700'}`}>{t('checkout.pickup')}</span>
                        <span className="text-xs text-gray-500 mt-1">10-15 min</span>
                    </label>
                </div>
            </div>

            {deliveryMethod === 'delivery' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div>
                        <textarea
                            {...register('address', { required: true })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-sm transition-all outline-none resize-none"
                            rows={2}
                            placeholder={t('checkout.address')}
                        />
                        {errors.address && <span className="text-red-500 text-xs">{t('checkout.required')}</span>}
                    </div>

                    <div>
                        <input
                            {...register('reference')}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-sm transition-all outline-none"
                            placeholder={t('checkout.reference')}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input
                            {...register('coords')}
                            readOnly
                            className="flex-1 px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl text-xs text-gray-500 cursor-not-allowed"
                            placeholder="Coordenadas GPS..."
                        />
                        <button
                            type="button"
                            onClick={getLocation}
                            disabled={locationLoading}
                            className="bg-gray-900 hover:bg-black text-white px-4 rounded-xl transition flex items-center gap-2 text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                        >
                            {locationLoading ? '...' : <><MapPin size={14} /> GPS</>}
                        </button>
                    </div>
                </div>
            )}

            <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{format(getSubtotal())}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Envío
                    </span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-uber-500' : 'text-gray-900'}`}>
                        {shippingCost === 0 ? 'Gratis' : format(shippingCost)}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{format(getTotalPrice())}</span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Smartphone size={20} />
                    <span>{t('checkout.whatsapp')}</span>
                </button>
            </div>
        </form>
    );
};
