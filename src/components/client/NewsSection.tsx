import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { NEWS_ITEMS } from '../../data/newsData';

export const NewsSection = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Novedades y Noticias</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {NEWS_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            to={`/blog/${item.id}`}
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
            </div>
        </section>
    );
};
