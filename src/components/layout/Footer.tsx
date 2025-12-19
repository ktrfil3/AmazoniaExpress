import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Brand & Social - Centered */}
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                    <Link to="/" className="group mb-6">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight group-hover:text-uber-500 transition-colors">
                            AMAZONIA <span className="text-uber-500 group-hover:text-gray-900 transition-colors">EXPRESS</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-2">Tu supermercado de confianza, ahora digital.</p>
                    </Link>

                    <div className="flex items-center gap-6 mb-8">
                        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-uber-500 hover:text-white transition-all transform hover:scale-110 shadow-sm">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110 shadow-sm">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-400 hover:text-white transition-all transform hover:scale-110 shadow-sm">
                            <Twitter className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-12">
                    {/* Address */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center md:justify-start gap-2">
                            <MapPin className="w-5 h-5 text-uber-500" />
                            Dirección
                        </h3>
                        <p className="text-gray-500 leading-relaxed">
                            Av. Principal de Santa Elena<br />
                            Santa Elena de Uairén<br />
                            Estado Bolívar, Venezuela
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="text-center">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5 text-uber-500" />
                            Contacto
                        </h3>
                        <p className="text-gray-500 mb-2">+58 424 931 7720</p>
                        <p className="text-gray-500 flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" />
                            contacto@amazoniaexpress.com
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="text-center md:text-right">
                        <h3 className="font-bold text-gray-900 text-uber-500 mb-4 flex items-center justify-center md:justify-end gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <p className="text-gray-900">Horario</p>
                        </h3>
                        <p className="text-gray-500">Lunes a Sábado: 8:00 AM - 8:00 PM</p>
                        <p className="text-gray-500">Domingos: 8:00 AM - 2:00 PM</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                        © 2025 Amazonia Express. Hecho con <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> by <a href="https://neuronixve.vercel.app" target="_blank" rel="noopener noreferrer">Neuronix</a> en Venezuela.
                    </p>
                </div>
            </div>
        </footer>
    );
};
