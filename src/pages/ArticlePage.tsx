
import { useParams, Link, useNavigate } from 'react-router-dom';
import { NEWS_ITEMS } from '../data/newsData';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

export const ArticlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = NEWS_ITEMS.find(item => item.id === Number(id));

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h2>
                <Link to="/" className="text-uber-600 hover:text-uber-800 font-semibold flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-grow">
                {/* Hero Header */}
                <div className="relative h-[400px] w-full">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto text-white">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            Volver a Noticias
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
                            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </span>
                            {article.author && (
                                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                    <User className="w-4 h-4" />
                                    {article.author}
                                </span>
                            )}
                            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4" />
                                5 min de lectura
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article className="max-w-3xl mx-auto px-4 py-12">
                    <div
                        className="prose prose-lg prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-img:rounded-xl prose-a:text-uber-600 hover:prose-a:text-uber-700 marker:text-uber-500"
                        dangerouslySetInnerHTML={{ __html: article.content || '' }}
                    />

                    {/* Share / Actions */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Atrás
                        </button>
                        <button
                            className="bg-uber-50 text-uber-700 hover:bg-uber-100 px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: article.title,
                                        text: article.excerpt,
                                        url: window.location.href,
                                    })
                                        .catch((error) => console.log('Error sharing', error));
                                } else {
                                    alert('¡Enlace copiado al portapapeles!'); // Simple fallback
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                        >
                            <Share2 className="w-4 h-4" />
                            Compartir
                        </button>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};
