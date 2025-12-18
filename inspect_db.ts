import sql from 'mssql';

const config = {
    user: 'userdesarrollointernoama',
    password: 'O8FZ2fmaEWkC4HR9E02Kf5',
    server: '192.168.10.100',
    database: 'AMAZONIA',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectionTimeout: 15000,
        requestTimeout: 15000
    },
};

async function inspect() {
    try {
        console.log('Connecting to DB at 192.168.10.100...');
        const pool = await sql.connect(config);
        console.log('Connected!');

        // Check SAINSTA (Instancias)
        const instResult = await pool.request().query('SELECT * FROM SAINSTA WHERE CodInst = 3030');
        console.log('\n--- SAINSTA (Based on CodInst 3030) ---');
        console.table(instResult.recordset);

        // Try SACALI again safely
        try {
            const caliResult = await pool.request().query('SELECT TOP 5 * FROM SACALI');
            console.log('\n--- SACALI (First 5) ---');
            console.table(caliResult.recordset);
        } catch (e) {
            console.log('\n--- SACALI Table not found ---');
        }

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

inspect();
