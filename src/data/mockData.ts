import type { Product } from '../types';

export const mockProducts: Product[] = [
    // Víveres
    { id: '1', nombre: 'Arroz Premium 1kg', precio: 1.50, stock: 100, categoria: 'Víveres', imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
    { id: '2', nombre: 'Aceite de Girasol 1L', precio: 2.80, stock: 50, categoria: 'Víveres', imagen: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=80&w=200' },

    // Ferretería
    { id: '3', nombre: 'Juego de Destornilladores', precio: 15.00, stock: 20, categoria: 'Ferretería', imagen: 'https://images.unsplash.com/photo-1581147036324-1e7acddba45f?auto=format&fit=crop&q=80&w=200' },
    { id: '4', nombre: 'Martillo', precio: 8.50, stock: 30, categoria: 'Ferretería', imagen: 'https://images.unsplash.com/photo-1586864387967-d0215df3e370?auto=format&fit=crop&q=80&w=200' },

    // Charcutería y Carnicería
    { id: '5', nombre: 'Jamón de Pierna 1kg', precio: 12.00, stock: 15, categoria: 'Charcutería y Carnicería', imagen: 'https://images.unsplash.com/photo-1608754181971-c07ae9d0ac61?auto=format&fit=crop&q=80&w=200' },
    { id: '6', nombre: 'Carne Molida 1kg', precio: 6.50, stock: 40, categoria: 'Charcutería y Carnicería', imagen: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=200' },

    // Quincallería
    { id: '7', nombre: 'Cuaderno Espiral', precio: 2.00, stock: 200, categoria: 'Quincallería', imagen: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=200' },
    { id: '8', nombre: 'Bolígrafos (Pack 3)', precio: 1.20, stock: 150, categoria: 'Quincallería', imagen: 'https://images.unsplash.com/photo-1585336261022-aa8095da314c?auto=format&fit=crop&q=80&w=200' },

    // Electrodomésticos
    { id: '9', nombre: 'Licuadora 200W', precio: 45.00, stock: 10, categoria: 'Electrodomésticos', imagen: 'https://images.unsplash.com/photo-1570222094114-28a9d8896c74?auto=format&fit=crop&q=80&w=200' },
    { id: '10', nombre: 'Tostadora', precio: 25.00, stock: 15, categoria: 'Electrodomésticos', imagen: 'https://images.unsplash.com/photo-1583726059046-64157ba3badd?auto=format&fit=crop&q=80&w=200' },

    // Maquillaje y Cuidado Personal
    { id: '11', nombre: 'Crema Hidratante', precio: 18.00, stock: 25, categoria: 'Maquillaje y Cuidado Personal', imagen: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200' },
    { id: '12', nombre: 'Labial Rojo', precio: 10.00, stock: 50, categoria: 'Maquillaje y Cuidado Personal', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200' },

    // Mascotas
    { id: '13', nombre: 'Alimento Perro 2kg', precio: 8.00, stock: 40, categoria: 'Mascotas', imagen: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&q=80&w=200' },
    { id: '14', nombre: 'Juguete para Gato', precio: 5.00, stock: 60, categoria: 'Mascotas', imagen: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=200' },

    // Farmacia
    { id: '15', nombre: 'Paracetamol 500mg', precio: 3.00, stock: 100, categoria: 'Farmacia', imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200' },
    { id: '16', nombre: 'Alcohol Isopropílico', precio: 4.50, stock: 80, categoria: 'Farmacia', imagen: 'https://images.unsplash.com/photo-1584813539806-2538b8d918c6?auto=format&fit=crop&q=80&w=200' },
];
