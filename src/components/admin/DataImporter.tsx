import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import type { Product } from '../../types';

export const DataImporter = () => {
    const { setProducts } = useProductStore();
    const [previewData, setPreviewData] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const bstr = event.target?.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const wsname = workbook.SheetNames[0];
                const ws = workbook.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                // Basic validation and mapping
                const mappedData: Product[] = data.map((item: any, index: number) => ({
                    id: item.ID || item.id || index + 1000,
                    nombre: item.Nombre || item.nombre || 'Sin nombre',
                    precio: Number(item.Precio || item.precio || 0),
                    stock: Number(item.Stock || item.stock || 0),
                    categoria: item.Categoría || item.Categoria || item.categoria || 'General',
                    imagen: item.URL_Imagen || item.imagen || ''
                }));

                setPreviewData(mappedData);
                setError(null);
                setSuccess(false); // Reset success until confirmed
            } catch (err) {
                setError('Error al leer el archivo. Asegúrate de que sea un Excel válido.');
                console.error(err);
            }
        };
        reader.readAsBinaryString(file);
    };

    const confirmImport = () => {
        if (previewData.length > 0) {
            setProducts(previewData);
            setSuccess(true);
            setPreviewData([]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileSpreadsheet className="text-green-600" /> Importador Masivo
            </h2>

            <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span> o arrastra y suelta</p>
                        <p className="text-xs text-gray-500">XLSX o XML (Formato MySQL dump simulado)</p>
                    </div>
                    <input type="file" className="hidden" accept=".xlsx, .xls, .xml" onChange={handleFileUpload} />
                </label>
            </div>

            {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg flex items-center gap-2">
                    <CheckCircle size={20} /> Datos importados exitosamente al catálogo.
                </div>
            )}

            {previewData.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-semibold mb-2">Vista Previa ({previewData.length} productos)</h3>
                    <div className="overflow-x-auto border rounded-lg max-h-60 mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.slice(0, 5).map((prod) => (
                                    <tr key={prod.id}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{prod.nombre}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{prod.categoria}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${prod.precio}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{prod.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.length > 5 && <p className="p-2 text-xs text-center text-gray-500">...y {previewData.length - 5} más</p>}
                    </div>

                    <button
                        onClick={confirmImport}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} /> Confirmar Importación
                    </button>
                </div>
            )}
        </div>
    );
};
