import { useState, type TouchEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import type { CartItem } from '../../types';

interface SwipeableCartItemProps {
    item: CartItem;
    onRemove: (id: string | number) => void;
}

export const SwipeableCartItem = ({ item, onRemove }: SwipeableCartItemProps) => {
    const { format } = useCurrencyStore();
    const [startX, setStartX] = useState<number | null>(null);
    const [currentX, setCurrentX] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Threshold to trigger delete state or snap
    const SWIPE_THRESHOLD = -80; // px

    const handleTouchStart = (e: TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (startX === null) return;
        const diff = e.touches[0].clientX - startX;

        // Only allow swiping left
        if (diff < 0 && diff > -120) {
            setCurrentX(diff);
        }
    };

    const handleTouchEnd = () => {
        if (currentX < SWIPE_THRESHOLD) {
            // Snap to open
            setCurrentX(-100);
            setIsDeleting(true);
        } else {
            // Snap back to closed
            setCurrentX(0);
            setIsDeleting(false);
        }
        setStartX(null);
    };

    return (
        <div className="relative overflow-hidden mb-3 select-none touch-pan-y">
            {/* Background (Delete Button) */}
            <div className="absolute inset-0 flex justify-end items-center bg-red-500 rounded-lg pr-4">
                <Trash2 className="text-white w-6 h-6" />
            </div>

            {/* Foreground Content */}
            <div
                className="relative bg-white flex items-center gap-3 py-2 rounded-lg transition-transform duration-200 z-10"
                style={{ transform: `translateX(${currentX}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ml-2">
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-500">{item.quantity}x {format(item.precio)}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 pr-2">{format(item.precio * item.quantity)}</span>
            </div>

            {/* Overlay button for actual deletion when swiped */}
            {isDeleting && (
                <button
                    className="absolute inset-y-0 right-0 w-[100px] z-20 flex justify-end items-center pr-4"
                    onClick={() => {
                        // Animate out? For now just remove
                        onRemove(item.id);
                    }}
                >
                    {/* Transparent click target over the red area */}
                </button>
            )}
        </div>
    );
};
