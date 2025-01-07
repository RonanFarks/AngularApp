const sql = require('mssql');

const config = {
    user: 'Your Username',
    password: 'Your password',
    server: 'Your Server Name', // e.g., localhost
    database: 'Your Database',
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
