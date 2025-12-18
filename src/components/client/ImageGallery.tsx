import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
            </div>
        );
    }

    const next = () => setSelectedIndex((prev) => (prev + 1) % images.length);
    const prev = () => setSelectedIndex((p) => (p - 1 + images.length) % images.length);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                <img
                    src={images[selectedIndex]}
                    alt={`${productName} - ${selectedIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                    <>
                        {/* Navigation Arrows */}
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? 'bg-white w-6' : 'bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === selectedIndex ? 'border-uber-500' : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
