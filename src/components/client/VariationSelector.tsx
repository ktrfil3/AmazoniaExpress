import type { Variacion } from '../../types';

interface VariationSelectorProps {
    variaciones: Variacion[];
    selectedVariations: Record<string, string>;
    onChange: (tipo: string, valor: string) => void;
}

export const VariationSelector = ({ variaciones, selectedVariations, onChange }: VariationSelectorProps) => {
    if (!variaciones || variaciones.length === 0) return null;

    return (
        <div className="space-y-4">
            {variaciones.map((variacion) => (
                <div key={variacion.tipo}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {variacion.nombre}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variacion.opciones.map((opcion) => {
                            const isSelected = selectedVariations[variacion.tipo] === opcion.valor;
                            const isOutOfStock = opcion.stockDisponible !== undefined && opcion.stockDisponible === 0;

                            return (
                                <button
                                    key={opcion.valor}
                                    onClick={() => !isOutOfStock && onChange(variacion.tipo, opcion.valor)}
                                    disabled={isOutOfStock}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${isSelected
                                        ? 'border-uber-500 bg-uber-50 text-uber-700'
                                        : isOutOfStock
                                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                        }`}
                                >
                                    {opcion.valor}
                                    {opcion.precioExtra && opcion.precioExtra > 0 && (
                                        <span className="ml-1 text-xs">+${opcion.precioExtra}</span>
                                    )}
                                    {isOutOfStock && (
                                        <span className="ml-1 text-xs">(Agotado)</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
