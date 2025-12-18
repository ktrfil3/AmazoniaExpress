import { useState } from 'react';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { DollarSign, Save, RotateCcw, Info } from 'lucide-react';

export const CurrencyManager = () => {
    const { rates, updateRates } = useCurrencyStore();

    const [brlRate, setBrlRate] = useState(rates.BRL);
    const [usdRate, setUsdRate] = useState(rates.USD);
    const [vesRate, setVesRate] = useState(rates.VES);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateRates({
            BRL: brlRate,
            USD: usdRate,
            VES: vesRate
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        const defaultRates = { BRL: 1, USD: 0.20, VES: 7.30 };
        setBrlRate(defaultRates.BRL);
        setUsdRate(defaultRates.USD);
        setVesRate(defaultRates.VES);
        updateRates(defaultRates);
    };

    return (
        <div className="bg-white rounded-2xl shadow-uber border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-uber-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-uber-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Tasas de Cambio</h2>
                    <p className="text-sm text-gray-500">Configura todas las tasas de conversión</p>
                </div>
            </div>

            <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                    <strong>Importante:</strong> Todas las tasas son editables. Ajusta los valores según las tasas de cambio actuales del mercado.
                </p>
            </div>

            <div className="space-y-4 mb-6">
                {/* BRL - Base (ahora editable) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Real Brasileño (BRL) - Moneda Base
                    </label>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-600">R$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={brlRate}
                            onChange={(e) => setBrlRate(parseFloat(e.target.value) || 1)}
                            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-base font-medium transition-all outline-none"
                            placeholder="1.00"
                        />
                        <span className="text-sm text-gray-500 w-24">Multiplicador</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Normalmente 1, pero puedes ajustarlo si necesitas un multiplicador global
                    </p>
                </div>

                {/* USD */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dólar (USD)
                    </label>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={usdRate}
                            onChange={(e) => setUsdRate(parseFloat(e.target.value) || 0)}
                            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-base font-medium transition-all outline-none"
                            placeholder="0.20"
                        />
                        <span className="text-sm text-gray-500 w-24">por BRL</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Tasa actual: 1 BRL = {usdRate.toFixed(4)} USD
                    </p>
                </div>

                {/* VES */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bolívar (VES)
                    </label>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-orange-600">Bs</span>
                        <input
                            type="number"
                            step="0.01"
                            value={vesRate}
                            onChange={(e) => setVesRate(parseFloat(e.target.value) || 0)}
                            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-uber-500 focus:bg-white rounded-xl text-base font-medium transition-all outline-none"
                            placeholder="7.30"
                        />
                        <span className="text-sm text-gray-500 w-24">por BRL</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Tasa actual: 1 BRL = {vesRate.toFixed(2)} VES
                    </p>
                </div>
            </div>

            {/* Example Conversions */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Vista Previa de Conversión</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">R$ 100.00 =</span>
                        <div className="space-x-3">
                            <span className="font-semibold text-blue-600">${(100 * usdRate).toFixed(2)} USD</span>
                            <span className="font-semibold text-orange-600">Bs {(100 * vesRate).toFixed(2)} VES</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">R$ 50.00 =</span>
                        <div className="space-x-3">
                            <span className="font-semibold text-blue-600">${(50 * usdRate).toFixed(2)} USD</span>
                            <span className="font-semibold text-orange-600">Bs {(50 * vesRate).toFixed(2)} VES</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-uber-500 hover:bg-uber-600 text-white'
                        }`}
                >
                    <Save className="w-5 h-5" />
                    {saved ? '¡Guardado!' : 'Guardar Cambios'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold text-gray-700 transition-all flex items-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    Resetear
                </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Los precios en la tienda se almacenan en BRL.
                    Los clientes pueden cambiar la moneda y verán los precios convertidos según estas tasas.
                </p>
            </div>
        </div>
    );
};
