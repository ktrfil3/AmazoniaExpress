import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

const NEWS_ITEMS = [
    {
        id: 1,
        title: "¡Nuevos Productos Importados!",
        excerpt: "Descubre nuestra nueva selección de chocolates y snacks traídos directamente de Brasil. ¡Sabores únicos te esperan!",
        date: "18 Dic 2025",
        image: "https://images.unsplash.com/photo-1582401656397-9d777d4c2b02?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Horario Especial de Navidad",
        excerpt: "Estas fiestas estaremos abiertos para ti. Revisa nuestros horarios extendidos para que no te falte nada en tu cena navideña.",
        date: "15 Dic 2025",
        image: "https://images.unsplash.com/photo-1543091993-8cfb469b820d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Receta: Cena Perfecta",
        excerpt: "Aprende a preparar un plato exquisito con ingredientes que encuentras en nuestros pasillos. ¡Sorprende a tu familia!",
        date: "10 Dic 2025",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

export const NewsSection = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Novedades y Noticias</h2>
                    <Link to="/blog" className="hidden sm:flex items-center gap-2 text-uber-600 font-semibold hover:text-uber-700 transition-colors">
                        Ver todas
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {NEWS_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            to="/blog"
                            className="group block bg-white rounded-2xl overflow-hidden shadow-uber hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-gray-700 shadow-sm">
                                    <Calendar className="w-3 h-3 text-uber-500" />
                                    {item.date}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-uber-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {item.excerpt}
                                </p>
                                <span className="inline-flex items-center text-sm font-bold text-uber-500 group-hover:gap-2 transition-all">
                                    Leer más <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-uber-600 font-bold">
                        Ver todas las noticias
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
