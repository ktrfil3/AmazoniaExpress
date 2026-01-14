import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from 'mssql';
import 'dotenv/config';

const config = {
    user: process.env.DB_USER || 'userdesarrollointernoama',
    password: process.env.DB_PASSWORD || 'O8FZ2fmaEWkC4HR9E02Kf5',
    server: process.env.DB_SERVER || '0.tcp.sa.ngrok.io',
    database: process.env.DB_NAME || 'AMAZONIA',
    port: parseInt(process.env.DB_PORT || '16824'),
    options: {
        encrypt: false, // Ensure this matches your server config
        trustServerCertificate: true,
        enableArithAbort: true, // Required to prevent socket hang up
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1' as any
        }
    },
};

console.log('🔌 DB Config:', {
    server: config.server,
    port: config.port,
    user: config.user,
    database: config.database
});

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

    let pool;
    try {
        pool = await new sql.ConnectionPool({
            ...config,
            connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
            requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT || '30000')
        }).connect();

        const result = await pool.request().query(`
            SELECT 
                P.CodProd as id, 
                P.Descrip as nombre, 
                CASE WHEN P.PrecioU > 0 THEN P.PrecioU ELSE P.Precio1 END as precio, 
                P.Precio1 as precioMayor, 
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
        // Return 500 to debug the connection issue
        res.status(500).json({
            error: 'Database Connection Failed',
            details: err.message,
            code: err.code,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } finally {
        if (pool) {
            try {
                await pool.close();
                console.log('🔒 Connection pool closed');
            } catch (closeErr) {
                console.error('Error closing pool:', closeErr);
            }
        }
    }

}
