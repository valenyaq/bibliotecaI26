const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones
let pool;

// Si existe DATABASE_URL, usarla directamente (formato: mysql://user:password@host:port/database)
if (process.env.DATABASE_URL) {
  console.log('Usando DATABASE_URL para la conexión');
  pool = mysql.createPool(process.env.DATABASE_URL + '?connectTimeout=60000');
} else {
  console.log('Usando variables individuales para la conexión');
  // Usar variables individuales
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'biblioteca_virtual',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000 // Aumentar el tiempo de espera a 60 segundos
  });
}

// Verificar conexión a la base de datos
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
}

// Función para ejecutar consultas
async function query(sql, params) {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error al ejecutar consulta SQL:', error);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  testConnection
}; 