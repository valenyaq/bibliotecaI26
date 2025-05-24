const { query } = require('../config/db');

// Obtener valoraciones de un libro
const getValoracionesByLibroId = async (libroId) => {
  const sql = 'SELECT * FROM valoraciones WHERE libro_id = ? ORDER BY fecha DESC';
  return await query(sql, [libroId]);
};

// Crear una nueva valoración
const createValoracion = async (valoracionData) => {
  try {
    const { libro_id, puntuacion, comentario, nombre_usuario } = valoracionData;
    
    // Validar que los datos sean correctos
    if (!libro_id || isNaN(parseInt(libro_id))) {
      throw new Error('ID de libro inválido');
    }
    
    if (!puntuacion || isNaN(parseInt(puntuacion)) || puntuacion < 1 || puntuacion > 5) {
      throw new Error('Puntuación inválida (debe ser entre 1 y 5)');
    }
    
    if (!nombre_usuario || typeof nombre_usuario !== 'string') {
      throw new Error('Nombre de usuario inválido');
    }
    
    // Preparar los datos para la inserción
    const libroIdInt = parseInt(libro_id, 10);
    const puntuacionInt = parseInt(puntuacion, 10);
    const comentarioStr = comentario || null;
    const nombreUsuarioStr = nombre_usuario.trim();
    
    const sql = 'INSERT INTO valoraciones (libro_id, puntuacion, comentario, nombre_usuario) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [libroIdInt, puntuacionInt, comentarioStr, nombreUsuarioStr]);
    
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// Obtener la valoración promedio de un libro
const getValoracionPromedio = async (libroId) => {
  const sql = 'SELECT AVG(puntuacion) as promedio FROM valoraciones WHERE libro_id = ?';
  const resultado = await query(sql, [libroId]);
  return resultado[0].promedio || 0;
};

// Contar valoraciones para un libro
const countValoraciones = async (libroId) => {
  const sql = 'SELECT COUNT(*) as total FROM valoraciones WHERE libro_id = ?';
  const resultado = await query(sql, [libroId]);
  return resultado[0].total;
};

module.exports = {
  getValoracionesByLibroId,
  createValoracion,
  getValoracionPromedio,
  countValoraciones
}; 