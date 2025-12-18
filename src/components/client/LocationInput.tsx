import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const LocationInput = () => {
    const [address, setAddress] = useState('');

    const getCurrentLocation = async () => {
        const fetchIpLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.city && data.region) {
                    setAddress(`${data.city}, ${data.region}`);
                } else {
                    alert('No se pudo determinar la ubicación automáticamente.');
                }
            } catch (error) {
                console.error("Error fetching IP location:", error);
                alert('Error al obtener ubicación por IP.');
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (_position) => {
                    // Simulate reverse geocoding or use real API if available
                    // For now keeping manual simulation or use IP as clearer fallback for city
                    fetchIpLocation();
                },
                (error) => {
                    console.warn("GPS Access Denied or Error, falling back to IP", error);
                    fetchIpLocation();
                }
            );
        } else {
            fetchIpLocation();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-uber p-4 mb-6">
            <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Santa Elena de Uairén, Municipio Gran Sabana..."
                        className="w-full text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                </div>
                <button
                    onClick={getCurrentLocation}
                    className="text-uber-500 hover:text-uber-600 transition-colors flex-shrink-0"
                >
                    <Navigation className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
