import sql from 'mssql';

const config = {
    user: 'userdesarrollointernoama',
    password: 'O8FZ2fmaEWkC4HR9E02Kf5',
    server: '0.tcp.sa.ngrok.io', // Public IP
    database: 'AMAZONIA',
    port: 11699,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        connectionTimeout: 5000, // Short timeout for test
        requestTimeout: 5000
    },
};

async function testConnection() {
    console.log(`📡 Testing connection to PUBLIC IP: ${config.server}...`);
    try {
        const pool = await sql.connect(config);
        console.log('✅ SUCCESS! Connected to SQL Server via Public IP.');

        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log('📊 Server Version:', result.recordset[0].version);

        await pool.close();
    } catch (err: any) {
        console.error('❌ FAILED to connect via Public IP.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        console.error('Error Code:', err.code);

        if (err.message.includes('timeout')) {
            console.log('\n⚠️  TIMEOUT: This usually means the Firewall is dropping the packet (Port 1433 Closed/Filtered).');
            console.log('   OR: Your router does not support NAT Loopback (connecting to own Public IP from inside).');
        }
    }
}

testConnection();
