const valoracionModel = require('../models/valoracion.model');
const { testConnection } = require('../config/db');

// Obtener todas las valoraciones de un libro
const getValoracionesByLibro = async (req, res) => {
  try {
    await testConnection(); // Verificar conexión a la BD
    const libroId = req.params.id;
    const valoraciones = await valoracionModel.getValoracionesByLibroId(libroId);
    res.json(valoraciones);
  } catch (error) {
    console.error(`Error al obtener valoraciones del libro ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las valoraciones',
      error: error.message
    });
  }
};

// Obtener el promedio de valoraciones de un libro
const getPromedioByLibro = async (req, res) => {
  try {
    await testConnection();
    const libroId = req.params.id;
    const promedio = await valoracionModel.getValoracionPromedio(libroId);
    res.json(promedio);
  } catch (error) {
    console.error(`Error al obtener promedio de valoraciones del libro ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el promedio de valoraciones',
      error: error.message
    });
  }
};

// Crear una nueva valoración (sin autenticación)
const createValoracion = async (req, res) => {
  try {
    await testConnection();
    const libroId = req.params.id;
    
    // Los datos ya fueron validados por el middleware de Joi
    const { puntuacion, comentario, nombre_usuario } = req.body;
    
    // Crear nueva valoración
    const valoracionData = {
      libro_id: libroId,
      puntuacion: parseInt(puntuacion, 10), // Asegurar que sea un número
      comentario: comentario || null,
      nombre_usuario: nombre_usuario.trim()
    };
    
    try {
      const valoracionId = await valoracionModel.createValoracion(valoracionData);
      
      res.status(201).json({
        success: true,
        message: 'Valoración creada correctamente',
        valoracionId
      });
    } catch (dbError) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al insertar en la base de datos',
        error: dbError.message,
        sqlMessage: dbError.sqlMessage || 'No hay mensaje SQL disponible'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la valoración',
      error: error.message
    });
  }
};

// Obtener todas las valoraciones
const getAllValoraciones = async (req, res) => {
  try {
    await testConnection(); // Verificar conexión a la BD
    const valoraciones = await valoracionModel.getAllValoraciones();
    res.json(valoraciones);
  } catch (error) {
    console.error('Error al obtener todas las valoraciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener todas las valoraciones',
      error: error.message
    });
  }
};

module.exports = {
  getValoracionesByLibro,
  getPromedioByLibro,
  createValoracion,
  getAllValoraciones
};
