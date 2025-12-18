import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from 'mssql';

const config = {
    user: process.env.DB_USER || 'userdesarrollointernoama',
    password: process.env.DB_PASSWORD || 'O8FZ2fmaEWkC4HR9E02Kf5',
    server: process.env.DB_SERVER || '200.149.92.208',
    database: process.env.DB_NAME || 'AMAZONIA',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true, // Use true for Azure, false might be needed for local self-signed
        trustServerCertificate: true, // Change to false for production with valid certs
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        const pool = await sql.connect(config);

        // ADJUST THIS QUERY BASED ON YOUR EXACT TABLE NAMES
        // Assumed Saint structure: SPRODUCTOS or SAPROD
        // Descrip: Name/Description
        // Precio1: Detail Price
        // Precio2: Wholesale Price
        // Existen: Stock
        // CodProd: ID
        const result = await pool.request().query(`
      SELECT 
        CodProd as id, 
        Descrip as nombre, 
        Precio1 as precio, 
        Precio2 as precioMayor, 
        Existen as stock,
        instancia as categoria -- Assuming 'instancia' maps to category/department
      FROM SAPROD
      WHERE Existen > 0
    `);

        // Map to your Product interface structure if needed, or return raw if it matches
        const products = result.recordset.map((row: any) => ({
            id: row.id,
            nombre: row.nombre,
            precio: row.precio,
            precioMayor: row.precioMayor,
            stock: row.stock,
            categoria: 'Víveres', // Default, or map 'row.categoria' to your Department types
            imagen: 'https://placehold.co/400x300?text=No+Image', // Placeholder
            description: row.nombre // Use name as description if no separate desc
        }));

        res.status(200).json(products);
    } catch (err: any) {
        console.error('SQL Error:', err);
        res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
}
