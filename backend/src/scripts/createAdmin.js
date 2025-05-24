const { createAdmin, getAdminByUsername } = require('../models/admin.model');
require('dotenv').config();

async function createDefaultAdmin() {
  try {
    // Datos para el administrador por defecto
    const adminData = {
      username: 'admin2',
      password: 'admin1234'
    };

    // Comprobar si ya existe
    const existingAdmin = await getAdminByUsername(adminData.username);
    
    if (existingAdmin) {
      console.log(`El administrador '${adminData.username}' ya existe.`);
      return;
    }
    
    // Crear el administrador
    const adminId = await createAdmin(adminData);
    console.log(`Administrador creado correctamente con ID: ${adminId}`);
  } catch (error) {
    console.error('Error al crear el administrador:', error);
  } finally {
    // Cerrar la conexión después de completar la operación
    process.exit();
  }
}

// Ejecutar la función
createDefaultAdmin(); 