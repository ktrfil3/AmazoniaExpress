import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'es' | 'pt';

interface LanguageState {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    es: {
        'welcome': 'Bienvenido',
        'home': 'Inicio',
        'shop': 'Tienda',
        'account': 'Cuenta',
        'logout': 'Cerrar Sesión',
        'login': 'Ingresar',
        'admin': 'Admin',
        'hero.title': 'Frescura &',
        'hero.subtitle': 'Simplicidad.',
        'hero.description': 'Descubre una nueva forma de comprar. Calidad premium, precios honestos y la conveniencia que mereces, directo a tu puerta.',
        'hero.search': 'Buscar productos...',
        'categories.title': 'Categorías Principales',
        'categories.viewAll': 'Ver Todo',
        'products.all': 'Todos los Productos',
        'products.items': 'artículos',
        'products.noResults': 'No se encontraron productos.',
        'products.clearFilters': 'Limpiar filtros',
        'cart.title': 'Tu Pedido',
        'cart.secure': 'Seguro',
        'cart.empty': 'Tu carrito está vacío.',
        'cart.addItems': 'Agrega productos para comenzar.',
        'checkout.name': 'Nombre Completo',
        'checkout.phone': 'Teléfono',
        'checkout.deliveryMethod': 'Método de Entrega',
        'checkout.delivery': 'Envío',
        'checkout.pickup': 'Retiro',
        'checkout.address': 'Dirección',
        'checkout.reference': 'Puntos de Referencia',
        'checkout.gps': 'Ubicación GPS',
        'checkout.get': 'Obtener',
        'checkout.total': 'Total a Pagar',
        'checkout.whatsapp': 'Finalizar por WhatsApp',
        'checkout.required': 'Requerido',
        'login.welcome': 'Bienvenido',
        'login.subtitle': 'Ingresa a Goru Market',
        'login.email': 'Email',
        'login.phone': 'Teléfono',
        'login.emailLabel': 'Correo Electrónico',
        'login.phoneLabel': 'Número de Teléfono',
        'login.sendCode': 'Enviar Código',
        'login.verificationCode': 'Código de Verificación',
        'login.verify': 'Verificar e Ingresar',
        'login.back': 'Volver',
    },
    pt: {
        'welcome': 'Bem-vindo',
        'home': 'Início',
        'shop': 'Loja',
        'account': 'Conta',
        'logout': 'Sair',
        'login': 'Entrar',
        'admin': 'Admin',
        'hero.title': 'Frescor &',
        'hero.subtitle': 'Simplicidade.',
        'hero.description': 'Descubra uma nova forma de comprar. Qualidade premium, preços honestos e a conveniência que você merece, direto na sua porta.',
        'hero.search': 'Buscar produtos...',
        'categories.title': 'Categorias Principais',
        'categories.viewAll': 'Ver Tudo',
        'products.all': 'Todos os Produtos',
        'products.items': 'itens',
        'products.noResults': 'Nenhum produto encontrado.',
        'products.clearFilters': 'Limpar filtros',
        'cart.title': 'Seu Pedido',
        'cart.secure': 'Seguro',
        'cart.empty': 'Seu carrinho está vazio.',
        'cart.addItems': 'Adicione produtos para começar.',
        'checkout.name': 'Nome Completo',
        'checkout.phone': 'Telefone',
        'checkout.deliveryMethod': 'Método de Entrega',
        'checkout.delivery': 'Entrega',
        'checkout.pickup': 'Retirada',
        'checkout.address': 'Endereço',
        'checkout.reference': 'Pontos de Referência',
        'checkout.gps': 'Localização GPS',
        'checkout.get': 'Obter',
        'checkout.total': 'Total a Pagar',
        'checkout.whatsapp': 'Finalizar pelo WhatsApp',
        'checkout.required': 'Obrigatório',
        'login.welcome': 'Bem-vindo',
        'login.subtitle': 'Entre no Goru Market',
        'login.email': 'Email',
        'login.phone': 'Telefone',
        'login.emailLabel': 'E-mail',
        'login.phoneLabel': 'Número de Telefone',
        'login.sendCode': 'Enviar Código',
        'login.verificationCode': 'Código de Verificação',
        'login.verify': 'Verificar e Entrar',
        'login.back': 'Voltar',
    }
};

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'es',
            setLanguage: (language) => set({ language }),
            t: (key) => {
                const { language } = get();
                return translations[language][key] || key;
            }
        }),
        {
            name: 'language-storage'
        }
    )
);
