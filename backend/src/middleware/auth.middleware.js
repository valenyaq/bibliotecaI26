const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar si el usuario está autenticado como administrador
const isAdmin = (req, res, next) => {
  try {
    // Obtener el token del encabezado
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso no autorizado. Token no proporcionado' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'biblioteca_secretkey2024');
    
    // Verificar si es administrador
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso prohibido. Se requieren privilegios de administrador' 
      });
    }
    
    // Añadir la información del usuario al objeto de solicitud
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor al autenticar' 
    });
  }
};

// Middleware para verificar si el usuario está autenticado (cualquier usuario)
const isAuthenticated = (req, res, next) => {
  try {
    // Obtener el token del encabezado
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso no autorizado. Token no proporcionado' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'biblioteca_secretkey2024');
    
    // Añadir la información del usuario al objeto de solicitud
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor al autenticar' 
    });
  }
};

module.exports = {
  isAdmin,
  isAuthenticated
}; 