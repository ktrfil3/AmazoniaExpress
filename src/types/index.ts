export type Department =
    | 'Víveres'
    | 'Ferretería'
    | 'Charcutería y Carnicería'
    | 'Quincallería'
    | 'Electrodomésticos'
    | 'Maquillaje y Cuidado Personal'
    | 'Mascotas'
    | 'Farmacia';

export type VariationType =
    | 'talla'
    | 'color'
    | 'sabor'
    | 'peso'
    | 'unidad'
    | 'volumen'
    | 'presentacion';

export interface VariacionOpcion {
    valor: string;
    precioExtra?: number;
    stockDisponible?: number;
}

export interface Variacion {
    tipo: VariationType;
    nombre: string;
    opciones: VariacionOpcion[];
}

export interface Review {
    id: string;
    productId: string;
    usuario: string;
    rating: number;
    comentario: string;
    fecha: string;
}

export interface Product {
    id: string | number;
    nombre: string;
    precio: number;
    precioMayor?: number; // Precio al mayor
    stock: number;
    categoria: Department;

    // Detalles extendidos
    descripcion?: string;
    marca?: string;
    sku?: string;

    // Imágenes
    imagen: string; // Imagen principal (backward compatible)
    imagenes?: string[]; // Galería adicional

    // Variaciones
    variaciones?: Variacion[];

    // Especificaciones técnicas
    especificaciones?: Record<string, string>;

    // Valoración
    rating?: number;
    totalReviews?: number;

    // Metadata
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem extends Product {
    quantity: number;
    selectedVariations?: Record<string, string>; // tipo -> valor seleccionado
}

export interface User {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    isAuthenticated: boolean;
}
