import { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const LocationInput = () => {
    const { setShippingAddress, shippingAddress } = useCartStore();
    const [address, setAddress] = useState(shippingAddress || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (shippingAddress) {
            setAddress(shippingAddress);
        }
    }, [shippingAddress]);

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAddress(val);
        setShippingAddress(val);
    };

    const getCurrentLocation = async () => {
        setLoading(true);
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Reverse Geocoding with OpenStreetMap (Nominatim)
                    // Note: Ensure usage limits are respected (1 req/sec)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'AmazoniaExpress/1.0'
                            }
                        }
                    );

                    if (!response.ok) throw new Error('Error en servicio de ubicación');

                    const data = await response.json();

                    // Construct a readable address
                    // Prioritize: road, suburb, city, state
                    const addr = data.address;
                    const components = [
                        addr.road,
                        addr.suburb || addr.neighbourhood,
                        addr.city || addr.town || addr.village,
                        addr.state
                    ].filter(Boolean);

                    const formattedAddress = components.join(', ');

                    setAddress(formattedAddress);
                    setShippingAddress(formattedAddress);
                } catch (error) {
                    console.error("Error obteniendo dirección:", error);
                    alert("No pudimos obtener la dirección exacta. Por favor ingrésala manualmente.");
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Error de geolocalización:", error);
                let msg = 'Error desconocido al obtener ubicación.';
                if (error.code === 1) msg = 'Permiso de ubicación denegado. Actívalo en tu navegador.';
                else if (error.code === 2) msg = 'Ubicación no disponible.';
                else if (error.code === 3) msg = 'Se agotó el tiempo de espera.';

                alert(msg);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-uber p-4 mb-6">
            <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                    <input
                        type="text"
                        value={address}
                        onChange={handleManualChange}
                        placeholder="Santa Elena de Uairén, Municipio Gran Sabana..."
                        className="w-full text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
                <button
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="text-uber-500 hover:text-uber-600 transition-colors flex-shrink-0 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};
