const Joi = require('joi');

// Esquema de validación para libros
const libroSchema = Joi.object({
  titulo: Joi.string().trim().min(2).max(100).required()
    .custom((value, helpers) => {
      // Verificar que no contenga números
      if (/\d/.test(value)) {
        return helpers.error('string.noNumbers');
      }
      return value;
    })
    .messages({
      'string.base': 'El título debe ser texto',
      'string.empty': 'El título no puede estar vacío',
      'string.min': 'El título debe tener al menos {#limit} caracteres',
      'string.max': 'El título no puede exceder los {#limit} caracteres',
      'string.noNumbers': 'El título no puede contener números',
      'any.required': 'El título es obligatorio'
    }),
  
  autor: Joi.string().trim().min(2).max(100).required()
    .custom((value, helpers) => {
      // Verificar que no contenga números
      if (/\d/.test(value)) {
        return helpers.error('string.noNumbers');
      }
      return value;
    })
    .messages({
      'string.base': 'El autor debe ser texto',
      'string.empty': 'El autor no puede estar vacío',
      'string.min': 'El autor debe tener al menos {#limit} caracteres',
      'string.max': 'El autor no puede exceder los {#limit} caracteres',
      'string.noNumbers': 'El autor no puede contener números',
      'any.required': 'El autor es obligatorio'
    }),
  
  descripcion: Joi.string().trim().allow('').max(2000)
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.max': 'La descripción no puede exceder los {#limit} caracteres'
    }),
  
  genero_id: Joi.number().integer().min(1).allow(null)
    .messages({
      'number.base': 'El ID de género debe ser un número',
      'number.integer': 'El ID de género debe ser un número entero',
      'number.min': 'El ID de género debe ser un número positivo'
    })
});

// Esquema de validación para valoraciones
const valoracionSchema = Joi.object({
  puntuacion: Joi.number().integer().min(1).max(5).required()
    .messages({
      'number.base': 'La puntuación debe ser un número',
      'number.integer': 'La puntuación debe ser un número entero',
      'number.min': 'La puntuación mínima es {#limit}',
      'number.max': 'La puntuación máxima es {#limit}',
      'any.required': 'La puntuación es obligatoria'
    }),
  
  comentario: Joi.string().trim().allow('').max(500)
    .messages({
      'string.base': 'El comentario debe ser texto',
      'string.max': 'El comentario no puede exceder los {#limit} caracteres'
    }),
  
  nombre_usuario: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.base': 'El nombre de usuario debe ser texto',
      'string.empty': 'El nombre de usuario no puede estar vacío',
      'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres',
      'string.max': 'El nombre de usuario no puede exceder los {#limit} caracteres',
      'any.required': 'El nombre de usuario es obligatorio'
    })
});

// Esquema de validación para géneros
const generoSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.base': 'El nombre del género debe ser texto',
      'string.empty': 'El nombre del género no puede estar vacío',
      'string.min': 'El nombre del género debe tener al menos {#limit} caracteres',
      'string.max': 'El nombre del género no puede exceder los {#limit} caracteres',
      'any.required': 'El nombre del género es obligatorio'
    })
});

// Esquema de validación para login
const loginSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required()
    .messages({
      'string.base': 'El nombre de usuario debe ser texto',
      'string.empty': 'El nombre de usuario no puede estar vacío',
      'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres',
      'string.max': 'El nombre de usuario no puede exceder los {#limit} caracteres',
      'any.required': 'El nombre de usuario es obligatorio'
    }),
  
  password: Joi.string().min(8).max(100).required()
    .messages({
      'string.base': 'La contraseña debe ser texto',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
      'string.max': 'La contraseña no puede exceder los {#limit} caracteres',
      'any.required': 'La contraseña es obligatoria'
    })
});

// Esquema de validación para cambio de contraseña
const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().min(8).max(100).required()
    .messages({
      'string.base': 'La contraseña actual debe ser texto',
      'string.empty': 'La contraseña actual no puede estar vacía',
      'string.min': 'La contraseña actual debe tener al menos {#limit} caracteres',
      'string.max': 'La contraseña actual no puede exceder los {#limit} caracteres',
      'any.required': 'La contraseña actual es obligatoria'
    }),
  
  newPassword: Joi.string().min(8).max(100).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'))
    .messages({
      'string.base': 'La nueva contraseña debe ser texto',
      'string.empty': 'La nueva contraseña no puede estar vacía',
      'string.min': 'La nueva contraseña debe tener al menos {#limit} caracteres',
      'string.max': 'La nueva contraseña no puede exceder los {#limit} caracteres',
      'string.pattern.base': 'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial',
      'any.required': 'La nueva contraseña es obligatoria'
    })
});

// Esquema de validación para creación de administrador
const adminCreateSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required()
    .messages({
      'string.base': 'El nombre de usuario debe ser texto',
      'string.empty': 'El nombre de usuario no puede estar vacío',
      'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres',
      'string.max': 'El nombre de usuario no puede exceder los {#limit} caracteres',
      'any.required': 'El nombre de usuario es obligatorio'
    }),
  
  password: Joi.string().min(8).max(100).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'))
    .messages({
      'string.base': 'La contraseña debe ser texto',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
      'string.max': 'La contraseña no puede exceder los {#limit} caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial',
      'any.required': 'La contraseña es obligatoria'
    })
});

module.exports = {
  libroSchema,
  valoracionSchema,
  generoSchema,
  loginSchema,
  passwordChangeSchema,
  adminCreateSchema
};
