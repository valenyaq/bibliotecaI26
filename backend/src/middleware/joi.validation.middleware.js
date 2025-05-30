const { 
  libroSchema, 
  valoracionSchema, 
  generoSchema, 
  loginSchema, 
  passwordChangeSchema, 
  adminCreateSchema 
} = require('./validation.schemas');

/**
 * Middleware para validar datos usando esquemas Joi
 * @param {Object} schema - Esquema Joi a utilizar para la validación
 * @returns {Function} Middleware de Express
 */
const validateWithJoi = (schema) => {
  return (req, res, next) => {
    // Validar el cuerpo de la solicitud contra el esquema
    const { error } = schema.validate(req.body, { 
      abortEarly: false, // Devuelve todos los errores, no solo el primero
      allowUnknown: true, // Permite propiedades no definidas en el esquema
      stripUnknown: false // No elimina propiedades no definidas en el esquema
    });
    
    // Si hay errores de validación, devolver respuesta de error
    if (error) {
      const errorDetails = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errorDetails
      });
    }
    
    // Si no hay errores, continuar con el siguiente middleware
    next();
  };
};

// Middleware para validar libros
const validateLibro = validateWithJoi(libroSchema);

// Middleware para validar valoraciones
const validateValoracion = validateWithJoi(valoracionSchema);

// Middleware para validar géneros
const validateGenero = validateWithJoi(generoSchema);

// Middleware para validar login
const validateLogin = validateWithJoi(loginSchema);

// Middleware para validar cambio de contraseña
const validatePasswordChange = validateWithJoi(passwordChangeSchema);

// Middleware para validar creación de administrador
const validateAdminCreate = validateWithJoi(adminCreateSchema);

module.exports = {
  validateLibro,
  validateValoracion,
  validateGenero,
  validateLogin,
  validatePasswordChange,
  validateAdminCreate
};
