const { query } = require('../config/db');

// Obtener comentarios de un libro
const getComentariosByLibroId = async (libroId) => {
  const sql = 'SELECT * FROM comentarios WHERE libro_id = ? ORDER BY fecha DESC';
  return await query(sql, [libroId]);
};

// Crear un nuevo comentario
const createComentario = async (comentarioData) => {
  const { libro_id, contenido } = comentarioData;
  const sql = 'INSERT INTO comentarios (libro_id, contenido) VALUES (?, ?)';
  const result = await query(sql, [libro_id, contenido]);
  return result.insertId;
};

// Eliminar un comentario
const deleteComentario = async (id) => {
  const sql = 'DELETE FROM comentarios WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows;
};

// Contar comentarios para un libro
const countComentarios = async (libroId) => {
  const sql = 'SELECT COUNT(*) as total FROM comentarios WHERE libro_id = ?';
  const resultado = await query(sql, [libroId]);
  return resultado[0].total;
};

module.exports = {
  getComentariosByLibroId,
  createComentario,
  deleteComentario,
  countComentarios
}; 