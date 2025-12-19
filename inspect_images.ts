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
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        }
    },
};

async function inspect() {
    try {
        await sql.connect(config);

        // Check for tables with 'IMA' or 'FOTO'
        const result = await sql.query`SELECT name FROM sys.tables WHERE name LIKE '%IMA%' OR name LIKE '%FOTO%'`;
        console.log('Potential Image Tables:', result.recordset);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sql.close();
    }
}

inspect();
