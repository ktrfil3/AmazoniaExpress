import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
    {
        id: 1,
        title: "¡Nuevos Productos Importados!",
        content: "Estamos muy emocionados de anunciar la llegada de nuestro nuevo contenedor con productos exclusivos desde Brasil. Hemos seleccionado cuidadosamente una variedad de chocolates Garoto, snacks Piraquê, y una selección premium de cafés que no encontrarás en ningún otro lugar. Ven y descubre los sabores que tenemos para ti.",
        category: "Productos",
        author: "Admin",
        date: "18 Dic 2025",
        image: "src/assets/coqui.jpeg"
    },
    {
        id: 2,
        title: "Horario Especial de Navidad",
        content: "Para que puedas realizar tus compras con tranquilidad, hemos extendido nuestro horario de atención durante las festividades. Del 20 al 24 de Diciembre estaremos abiertos de 7:00 AM a 10:00 PM. El día 25 abriremos mediodía. ¡Te esperamos para celebrar juntos!",
        category: "Anuncios",
        author: "Gerencia",
        date: "15 Dic 2025",
        image: "src/assets/mercado.jpeg"
    },
    {
        id: 3,
        title: "Receta: Cena Perfecta",
        content: "¿No sabes qué cocinar este fin de semana? Te traemos una receta fácil y deliciosa usando nuestros productos frescos. Pasta a la Carbonara con nuestro tocineta ahumada premium y queso parmesano importado. Sigue estos pasos para sorprender a todos...",
        category: "Recetas",
        author: "Chef Invitado",
        date: "10 Dic 2025",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    }
];

export const BlogPage = () => {
    return (
        <div className="min-h-screen bg-[#F6F6F6] pt-20 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 mb-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-uber-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a la tienda
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog & Noticias</h1>
                    <p className="text-xl text-gray-500">Mantente al día con lo último de Amazonia Express</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {BLOG_POSTS.map((post) => (
                    <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-64 md:h-96 w-full">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-uber-600 flex items-center gap-1 shadow-sm">
                                    <Tag className="w-3 h-3" />
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-uber-500" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-uber-500" />
                                    {post.author}
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {post.content}
                            </p>

                            <button className="text-uber-600 font-bold hover:text-uber-700 transition-colors">
                                Leer artículo completo →
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};
