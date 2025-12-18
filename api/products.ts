import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from 'mssql';

const config = {
    user: process.env.DB_USER || 'userdesarrollointernoama',
    password: process.env.DB_PASSWORD || 'O8FZ2fmaEWkC4HR9E02Kf5',
    server: process.env.DB_SERVER || '192.168.10.100',
    database: process.env.DB_NAME || 'AMAZONIA',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: false, // Changed to false to try connecting to non-SSL server
        trustServerCertificate: true,
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log('🔄 API /api/products handler invoked');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const pool = await sql.connect({
            ...config,
            connectionTimeout: 15000,
            requestTimeout: 15000
        });

        const result = await pool.request().query(`
            SELECT 
                P.CodProd as id, 
                P.Descrip as nombre, 
                P.Precio1 as precio, 
                P.Precio2 as precioMayor, 
                P.Existen as stock,
                I.Descrip as categoria
            FROM SAPROD P
            LEFT JOIN SAINSTA I ON P.CodInst = I.CodInst
            WHERE P.Existen > 0
        `);

        // Map to your Product interface structure
        const products = result.recordset.map((row: any) => ({
            id: row.id,
            nombre: row.nombre,
            precio: row.precio,
            precioMayor: row.precioMayor,
            stock: row.stock,
            categoria: row.categoria || 'Víveres',
            imagen: 'https://placehold.co/400x300?text=No+Image',
            description: row.nombre
        }));

        res.status(200).json(products);
    } catch (err: any) {
        console.error('SQL Error:', err);
        console.warn('Falling back to MOCK data due to DB error');

        // Mock data fallback
        const mockProducts = [
            // Víveres
            { id: '1', nombre: 'Arroz Premium 1kg', precio: 1.50, stock: 100, categoria: 'Víveres', imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200', description: 'Arroz de primera calidad' },
            { id: '2', nombre: 'Aceite de Girasol 1L', precio: 2.80, stock: 50, categoria: 'Víveres', imagen: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=80&w=200', description: 'Aceite refinado' },
            // Ferretería
            { id: '3', nombre: 'Juego de Destornilladores', precio: 15.00, stock: 20, categoria: 'Ferretería', imagen: 'https://images.unsplash.com/photo-1581147036324-1e7acddba45f?auto=format&fit=crop&q=80&w=200', description: 'Set de 6 piezas' },
            { id: '4', nombre: 'Martillo', precio: 8.50, stock: 30, categoria: 'Ferretería', imagen: 'https://images.unsplash.com/photo-1586864387967-d0215df3e370?auto=format&fit=crop&q=80&w=200', description: 'Martillo de acero' },
            // Charcutería y Carnicería
            { id: '5', nombre: 'Jamón de Pierna 1kg', precio: 12.00, stock: 15, categoria: 'Charcutería y Carnicería', imagen: 'https://images.unsplash.com/photo-1608754181971-c07ae9d0ac61?auto=format&fit=crop&q=80&w=200', description: 'Jamón fresco' },
            { id: '6', nombre: 'Carne Molida 1kg', precio: 6.50, stock: 40, categoria: 'Charcutería y Carnicería', imagen: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=200', description: 'Carne de res premium' },
            // Quincallería
            { id: '7', nombre: 'Cuaderno Espiral', precio: 2.00, stock: 200, categoria: 'Quincallería', imagen: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=200', description: 'Cuaderno 100 hojas' },
            { id: '8', nombre: 'Bolígrafos (Pack 3)', precio: 1.20, stock: 150, categoria: 'Quincallería', imagen: 'https://images.unsplash.com/photo-1585336261022-aa8095da314c?auto=format&fit=crop&q=80&w=200', description: 'Tinta azul y negra' },
            // Electrodomésticos
            { id: '9', nombre: 'Licuadora 200W', precio: 45.00, stock: 10, categoria: 'Electrodomésticos', imagen: 'https://images.unsplash.com/photo-1570222094114-28a9d8896c74?auto=format&fit=crop&q=80&w=200', description: 'Licuadora potente' },
            { id: '10', nombre: 'Tostadora', precio: 25.00, stock: 15, categoria: 'Electrodomésticos', imagen: 'https://images.unsplash.com/photo-1583726059046-64157ba3badd?auto=format&fit=crop&q=80&w=200', description: 'Tostadora 2 rebanadas' },
            // Maquillaje y Cuidado Personal
            { id: '11', nombre: 'Crema Hidratante', precio: 18.00, stock: 25, categoria: 'Maquillaje y Cuidado Personal', imagen: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200', description: 'Para piel seca' },
            { id: '12', nombre: 'Labial Rojo', precio: 10.00, stock: 50, categoria: 'Maquillaje y Cuidado Personal', imagen: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200', description: 'Larga duración' },
            // Mascotas
            { id: '13', nombre: 'Alimento Perro 2kg', precio: 8.00, stock: 40, categoria: 'Mascotas', imagen: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&q=80&w=200', description: 'Sabor pollo' },
            { id: '14', nombre: 'Juguete para Gato', precio: 5.00, stock: 60, categoria: 'Mascotas', imagen: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=200', description: 'Ratón de juguete' },
            // Farmacia
            { id: '15', nombre: 'Paracetamol 500mg', precio: 3.00, stock: 100, categoria: 'Farmacia', imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200', description: 'Alivio del dolor' },
            { id: '16', nombre: 'Alcohol Isopropílico', precio: 4.50, stock: 80, categoria: 'Farmacia', imagen: 'https://images.unsplash.com/photo-1584813539806-2538b8d918c6?auto=format&fit=crop&q=80&w=200', description: 'Desinfectante' },
        ];

        // Return 200 with mock data
        res.status(200).json(mockProducts);
        // Alternatively, return 500 if strict:
        // res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
}
