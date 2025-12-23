import type { CartItem } from '../types';

export interface DeliveryConfig {
    gasPrice: number;
    storeLocation: { lat: number; lng: number };
}

export interface DeliveryResult {
    vehicle: string;
    distanceKm: number;
    baseRate: number;
    fuelCost: number;
    totalCost: number;
    finalPrice: number;
    points: number;
    requiresQuote?: boolean;
}

// Default store location (example: Center of a city, user should change this)
export const DEFAULT_STORE_LOCATION = {
    lat: 4.598005, // Caracas example
    lng: -61.109820
};

// Calculate total "volumen" (points) of the cart
export const calculateCartPoints = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        // Rule: 10 points for wholesale (caja/bulto), 1 point for retail
        // We detect wholesale if price matches precioMayor OR if unit suggests box
        const isWholesale = (item.precioMayor && item.precio === item.precioMayor) ||
            item.selectedVariations?.['presentacion']?.toLowerCase().includes('caja') ||
            item.selectedVariations?.['presentacion']?.toLowerCase().includes('bulto');

        const pointsPerItem = isWholesale ? 10 : 1;
        return total + (pointsPerItem * item.quantity);
    }, 0);
};

// Haversine formula to calculate distance in km
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 1371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(2));
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export const calculateDeliveryRate = (
    distanceKm: number,
    cartPoints: number,
    gasPrice: number = 7.8
): DeliveryResult => {
    let vehiculo = "";
    let rendimiento = 0; // km per liter
    let factorRetorno = 1; // 1 = one way paid, 2 = round trip paid
    let tarifaBase = 0;

    // 1. Determine Vehicle by Points (Volumen)
    let requiresQuote = false;

    if (cartPoints <= 20) {
        vehiculo = "Moto (Delivery Express)";
        rendimiento = 35;
        tarifaBase = 5;
    } else if (cartPoints <= 200) {
        vehiculo = "Carro / Van";
        rendimiento = 10;
        tarifaBase = 20;
    } else if (cartPoints < 300000) {
        // 51 to ~29,999 bultos (approx 300,000 points)
        vehiculo = "Camión 350";
        rendimiento = 5;
        tarifaBase = 500;
        factorRetorno = 1.5;
        requiresQuote = true;
    } else {
        // 30,000+ bultos
        vehiculo = "Gandola (Carga Pesada)";
        rendimiento = 1.8;
        factorRetorno = 2;
        tarifaBase = 2000;
        requiresQuote = true;
    }

    // 2. Calculate Gas Cost
    let costoGasolinaPorKm = gasPrice / rendimiento;

    // 3. Final Calculation
    // Formula: (distancia * costoGasolina * retorno) + tarifaBase
    let fuelCostTotal = distanceKm * costoGasolinaPorKm * factorRetorno;
    let costoTotal = fuelCostTotal + tarifaBase;

    // 4. Add Margin (30%)
    let precioFinal = costoTotal * 1;

    return {
        vehicle: vehiculo,
        distanceKm,
        baseRate: tarifaBase,
        fuelCost: parseFloat(fuelCostTotal.toFixed(2)),
        totalCost: parseFloat(costoTotal.toFixed(2)),
        finalPrice: Math.ceil(precioFinal), // Round up for cleaner prices
        points: cartPoints,
        requiresQuote
    };
};
