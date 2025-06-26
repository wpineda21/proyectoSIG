const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
    
    // Probar PostGIS
    const result = await client.query('SELECT PostGIS_Version()');
    console.log('✅ PostGIS versión:', result.rows[0].postgis_version);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    return false;
  }
};

module.exports = { pool, testConnection };