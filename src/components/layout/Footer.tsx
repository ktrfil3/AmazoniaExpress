import { Facebook, Instagram, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tiktok = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pt-16 pb-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Brand & Social - Centered */}
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                    <Link to="/" className="group mb-6">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-uber-500 transition-colors">
                            AMAZONIA <span className="text-uber-500 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">EXPRESS</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Tu supermercado de confianza, ahora digital.</p>
                    </Link>

                    <div className="flex items-center gap-6 mb-8">
                        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-uber-500 hover:text-white dark:hover:text-white transition-all transform hover:scale-110 shadow-sm">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://www.instagram.com/amazonia_express/" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-pink-600 hover:text-white dark:hover:text-white transition-all transform hover:scale-110 shadow-sm">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="https://www.tiktok.com/@amazonia.express?_r=1&_t=ZM-92SvY1UoDhz" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-400 hover:text-white dark:hover:text-white transition-all transform hover:scale-110 shadow-sm">
                            <Tiktok className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 dark:border-gray-700 pt-12">
                    {/* Address */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center md:justify-start gap-2">
                            <MapPin className="w-5 h-5 text-uber-500" />
                            Dirección
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Av. Principal de Santa Elena<br />
                            Santa Elena de Uairén<br />
                            Estado Bolívar, Venezuela
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="text-center">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5 text-uber-500" />
                            Contacto
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">+58 424 931 7720</p>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" />
                            contacto@amazoniaexpress.com
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="text-center md:text-right">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center md:justify-end gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-uber-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span>Horario</span>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Lunes a Sábado: 8:00 AM - 8:00 PM</p>
                        <p className="text-gray-500 dark:text-gray-400">Domingos: 8:00 AM - 2:00 PM</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 dark:border-gray-700 mt-12 pt-8 text-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm flex flex-wrap items-center justify-center gap-1 px-4">
                        © 2025 Amazonia Express. Hecho con <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> by <a href="https://neuronixve.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-uber-500 transition-colors">Neuronix</a> en Venezuela.
                    </p>
                </div>
            </div>
        </footer>
    );
};
