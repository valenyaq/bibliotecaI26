const { query } = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener un administrador por su nombre de usuario
const getAdminByUsername = async (username) => {
  const sql = 'SELECT * FROM admin WHERE username = ?';
  const admins = await query(sql, [username]);
  return admins.length > 0 ? admins[0] : null;
};

// Crear un nuevo administrador
const createAdmin = async (adminData) => {
  const { username, password } = adminData;
  
  // Verificar si ya existe un admin con ese username
  const existingAdmin = await getAdminByUsername(username);
  if (existingAdmin) {
    throw new Error('Ya existe un administrador con ese nombre de usuario');
  }
  
  // Hash de la contraseña
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);
  
  const sql = 'INSERT INTO admin (username, password_hash) VALUES (?, ?)';
  const result = await query(sql, [username, password_hash]);
  return result.insertId;
};

// Verificar credenciales del administrador
const verifyAdminCredentials = async (username, password) => {
  const admin = await getAdminByUsername(username);
  if (!admin) {
    return null;
  }
  
  const passwordMatch = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatch) {
    return null;
  }
  
  return {
    id: admin.id,
    username: admin.username
  };
};

// Cambiar contraseña del administrador
const changeAdminPassword = async (adminId, newPassword) => {
  // Hash de la nueva contraseña
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(newPassword, saltRounds);
  
  const sql = 'UPDATE admin SET password_hash = ? WHERE id = ?';
  const result = await query(sql, [password_hash, adminId]);
  return result.affectedRows;
};

module.exports = {
  getAdminByUsername,
  createAdmin,
  verifyAdminCredentials,
  changeAdminPassword
}; 