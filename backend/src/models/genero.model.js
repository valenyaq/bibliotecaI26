const { query } = require('../config/db');

// Obtener todos los géneros
const getAllGeneros = async () => {
  const sql = 'SELECT * FROM generos ORDER BY nombre ASC';
  return await query(sql, []);
};

// Obtener un género por su ID
const getGeneroById = async (id) => {
  const sql = 'SELECT * FROM generos WHERE id = ?';
  const generos = await query(sql, [id]);
  return generos.length > 0 ? generos[0] : null;
};

// Crear un nuevo género
const createGenero = async (nombre) => {
  const sql = 'INSERT INTO generos (nombre) VALUES (?)';
  const result = await query(sql, [nombre]);
  return result.insertId;
};

// Actualizar un género
const updateGenero = async (id, nombre) => {
  const sql = 'UPDATE generos SET nombre = ? WHERE id = ?';
  const result = await query(sql, [nombre, id]);
  return result.affectedRows;
};

// Eliminar un género
const deleteGenero = async (id) => {
  const sql = 'DELETE FROM generos WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows;
};

module.exports = {
  getAllGeneros,
  getGeneroById,
  createGenero,
  updateGenero,
  deleteGenero
}; 