const jwt = require('jsonwebtoken');
require('dotenv').config();

// Obtener la clave secreta del JWT desde las variables de entorno
// IMPORTANTE: Esta clave debe ser configurada en el archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca_secretkey2024';

// Lista de tokens revocados (en una aplicación real, esto debería estar en una base de datos)
const revokedTokens = new Set();

// Función para revocar un token
const revokeToken = (token) => {
  revokedTokens.add(token);
};

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
    
    // Verificar si el token está revocado
    if (revokedTokens.has(token)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token revocado' 
      });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
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
    
    // Verificar si el token está revocado
    if (revokedTokens.has(token)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token revocado' 
      });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
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

// Middleware para limitar intentos de login (prevenir ataques de fuerza bruta)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos

const limitLoginAttempts = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Verificar si la IP está bloqueada
  if (loginAttempts[ip]) {
    const { count, timestamp } = loginAttempts[ip];
    const now = Date.now();
    
    // Si han pasado más de 15 minutos, reiniciar el contador
    if (now - timestamp > LOCKOUT_TIME) {
      loginAttempts[ip] = { count: 1, timestamp: now };
      return next();
    }
    
    // Si ha excedido el número máximo de intentos
    if (count >= MAX_ATTEMPTS) {
      const timeLeft = Math.ceil((LOCKOUT_TIME - (now - timestamp)) / 60000);
      return res.status(429).json({
        success: false,
        message: `Demasiados intentos de inicio de sesión. Inténtalo de nuevo en ${timeLeft} minutos.`
      });
    }
    
    // Incrementar el contador
    loginAttempts[ip].count++;
  } else {
    // Primer intento
    loginAttempts[ip] = { count: 1, timestamp: Date.now() };
  }
  
  next();
};

module.exports = {
  isAdmin,
  isAuthenticated,
  revokeToken,
  limitLoginAttempts
};