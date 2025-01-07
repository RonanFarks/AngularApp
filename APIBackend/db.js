const sql = require('mssql');

const config = {
    user: 'RonanF',
    password: '123',
    server: 'NBDB0012\\SQL2022', // e.g., localhost
    database: 'TEST',
    options: {
        encrypt: true, // Use encryption for Azure SQL (optional)
        trustServerCertificate: true, // Needed for self-signed certificates
    },
};

async function connect() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

module.exports = connect;
