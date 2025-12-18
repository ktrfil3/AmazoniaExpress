import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export const ImageUploader = ({ images, onChange, maxImages = 10 }: ImageUploaderProps) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        if (images.length + fileArray.length > maxImages) {
            alert(`Máximo ${maxImages} imágenes permitidas`);
            return;
        }

        setUploading(true);
        try {
            const results = await api.uploadMultipleImages(fileArray);
            const newUrls = results.map((r: any) => r.url);
            onChange([...images, ...newUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error al subir imágenes');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const moveImage = (from: number, to: number) => {
        const newImages = [...images];
        const [moved] = newImages.splice(from, 1);
        newImages.splice(to, 0, moved);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-uber-500 bg-uber-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files);
                }}
            >
                <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={uploading || images.length >= maxImages}
                />
                <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                >
                    <div className="bg-gray-100 p-4 rounded-full">
                        <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            {uploading ? 'Subiendo...' : 'Click para subir o arrastra imágenes'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF hasta 5MB ({images.length}/{maxImages})
                        </p>
                    </div>
                </label>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const from = parseInt(e.dataTransfer.getData('text/plain'));
                                moveImage(from, index);
                            }}
                        >
                            <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />

                            {/* Principal Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-uber-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    Principal
                                </div>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Drag Indicator */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
