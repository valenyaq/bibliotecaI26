const adminModel = require('../models/admin.model');
const jwt = require('jsonwebtoken');

// Login del administrador
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere nombre de usuario y contraseña'
      });
    }
    
    const admin = await adminModel.verifyAdminCredentials(username, password);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, isAdmin: true },
      process.env.JWT_SECRET || 'biblioteca_secretkey2024',
      { expiresIn: '12h' }
    );
    
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al iniciar sesión',
      error: error.message
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere la contraseña actual y la nueva contraseña'
      });
    }
    
    // Verificar la contraseña actual
    const admin = await adminModel.verifyAdminCredentials(req.user.username, currentPassword);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }
    
    // Cambiar la contraseña
    const affectedRows = await adminModel.changeAdminPassword(adminId, newPassword);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo cambiar la contraseña'
      });
    }
    
    res.json({
      success: true,
      message: 'Contraseña cambiada correctamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al cambiar la contraseña',
      error: error.message
    });
  }
};

// Nota: Las funciones getProfile y createAdmin han sido eliminadas por razones de seguridad

module.exports = {
  login,
  changePassword
};