import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

export const CartPage = () => {
    const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart, checkout } = useCartStore();
    const { format } = useCurrencyStore();

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        let message = `*🛒 PEDIDO - Amazonia Express*\n`;
        message += `📍 Santa Elena de Uairén, Estado Bolívar\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `*PRODUCTOS:*\n\n`;

        items.forEach((item, index) => {
            message += `${index + 1}. *${item.nombre}*\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio unitario: ${format(item.precio)}\n`;
            message += `   Subtotal: ${format(item.precio * item.quantity)}\n`;

            if (item.selectedVariations && Object.keys(item.selectedVariations).length > 0) {
                message += `   Variaciones: ${Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(', ')}\n`;
            }
            message += `\n`;
        });

        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*TOTAL: ${format(getTotalPrice())}*\n`;
        message += `Total de items: ${getTotalItems()}\n\n`;
        message += `Por favor confirma tu dirección de entrega.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/584249317720?text=${encodedMessage}`;

        // Record sale
        checkout({
            name: 'Cliente WhatsApp',
            phone: '',
            paymentMethod: 'WhatsApp'
        });

        window.open(whatsappUrl, '_blank');
        clearCart();
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F6F6F6] pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center py-16">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8">Agrega productos para comenzar tu pedido</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-uber-500 hover:bg-uber-600 text-white font-bold px-8 py-4 rounded-xl transition-colors"
                        >
                            Explorar productos
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F6F6] pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu Carrito</h1>
                    <p className="text-gray-600">{getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={`${item.id}-${JSON.stringify(item.selectedVariations)}`} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                        <img
                                            src={item.imagen}
                                            alt={item.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 mb-1">{item.nombre}</h3>
                                                {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {Object.entries(item.selectedVariations).map(([tipo, valor]) => (
                                                            <span key={tipo} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                                {tipo}: {valor}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-500">{format(item.precio)} c/u</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-900">{format(item.precio * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({getTotalItems()} items)</span>
                                    <span className="font-semibold">{format(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className="font-semibold text-green-600">GRATIS</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">{format(getTotalPrice())}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-uber-500 hover:bg-uber-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mb-3"
                            >
                                Finalizar pedido por WhatsApp
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <Link
                                to="/"
                                className="block text-center text-uber-500 hover:text-uber-600 font-semibold py-3 transition-colors"
                            >
                                Continuar comprando
                            </Link>

                            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                                <p className="text-sm text-green-800">
                                    <strong>✓ Envío gratis</strong> en Santa Elena de Uairén
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
