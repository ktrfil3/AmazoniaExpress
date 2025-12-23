import { useEffect } from 'react';
import { Truck, DollarSign } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { calculateCartPoints, calculateDeliveryRate, calculateDistance } from '../../services/deliveryCalculator';

interface DeliveryCalculatorProps {
    userLocation: { lat: number; lng: number } | null;
}

export const DeliveryCalculator = ({ userLocation }: DeliveryCalculatorProps) => {
    const { items, deliveryConfig, setDeliveryInfo, deliveryInfo } = useCartStore();
    const { format } = useCurrencyStore();

    // Recalculate if items, config, or userLocation changes
    useEffect(() => {
        if (userLocation) {
            const dist = calculateDistance(
                deliveryConfig.storeLocation.lat,
                deliveryConfig.storeLocation.lng,
                userLocation.lat,
                userLocation.lng
            );

            const points = calculateCartPoints(items);
            const rate = calculateDeliveryRate(dist, points, deliveryConfig.gasPrice);

            setDeliveryInfo({
                distance: rate.distanceKm,
                vehicle: rate.vehicle,
                cost: rate.finalPrice,
                requiresQuote: rate.requiresQuote
            });
        }
    }, [items, deliveryConfig, userLocation]);

    return (
        <div className="bg-white p-4 rounded-xl border-2 border-uber-100 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-uber-500" />
                    Cálculo de Envío
                </h3>
            </div>

            {!deliveryInfo || !userLocation ? (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                        Presiona el botón <strong>GPS</strong> arriba para calcular el envío.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-gray-600">Distancia:</span>
                        <span className="font-semibold">{deliveryInfo.distance} km</span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-gray-600">Vehículo asignado:</span>
                        <span className="font-semibold text-uber-600">{deliveryInfo.vehicle}</span>
                    </div>

                    <div className="bg-uber-50 p-3 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-uber-600" />
                            <span className="font-bold text-gray-800">Costo Estimado</span>
                        </div>
                        {deliveryInfo.requiresQuote ? (
                            <button
                                onClick={() => window.open(`https://wa.me/584249317720?text=Hola,%20quisiera%20cotizar%20un%20envio%20de%20carga%20pesada%20(${deliveryInfo.vehicle})`, '_blank')}
                                className="bg-black text-white px-3 py-1 rounded text-sm font-bold hover:bg-gray-800 transition"
                            >
                                Cotizar Envío
                            </button>
                        ) : (
                            <span className="text-xl font-bold text-uber-600">
                                {format(deliveryInfo.cost)}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
