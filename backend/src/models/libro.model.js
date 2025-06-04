const { query } = require('../config/db');

// Obtener todos los libros
const getAllLibros = async () => {
  const sql = `
    SELECT l.*, g.nombre as genero_nombre, 
    (SELECT AVG(puntuacion) FROM valoraciones WHERE libro_id = l.id) as valoracion_promedio
    FROM libros l
    LEFT JOIN generos g ON l.genero_id = g.id
    ORDER BY l.fecha_subida DESC
  `;
  return await query(sql, []);
};

// Obtener un libro por su ID
const getLibroById = async (id) => {
  const sql = `
    SELECT l.*, g.nombre as genero_nombre, 
    (SELECT AVG(puntuacion) FROM valoraciones WHERE libro_id = l.id) as valoracion_promedio
    FROM libros l
    LEFT JOIN generos g ON l.genero_id = g.id
    WHERE l.id = ?
  `;
  const libros = await query(sql, [id]);
  return libros.length > 0 ? libros[0] : null;
};

// Crear un nuevo libro
const createLibro = async (libroData) => {
  const { titulo, autor, descripcion, genero_id, portada_url, archivo_url } = libroData;
  
  // Validar que al menos tengamos los campos requeridos
  if (!titulo || !autor) {
    throw new Error('Título y autor son requeridos');
  }

  const sql = `
    INSERT INTO libros (titulo, autor, descripcion, genero_id, portada_url, archivo_url, fecha_subida)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const result = await query(sql, [titulo, autor, descripcion, genero_id, portada_url, archivo_url]);
  return result.insertId;
};

// Actualizar un libro
const updateLibro = async (id, libroData) => {
  const { titulo, autor, descripcion, genero_id, portada_url, archivo_url } = libroData;
  let sql = 'UPDATE libros SET ';
  const params = [];
  
  if (titulo) {
    sql += 'titulo = ?, ';
    params.push(titulo);
  }
  
  if (autor) {
    sql += 'autor = ?, ';
    params.push(autor);
  }
  
  if (descripcion !== undefined) {
    sql += 'descripcion = ?, ';
    params.push(descripcion);
  }
  
  if (genero_id) {
    sql += 'genero_id = ?, ';
    params.push(genero_id);
  }
  
  if (portada_url) {
    sql += 'portada_url = ?, ';
    params.push(portada_url);
  }
  
  if (archivo_url) {
    sql += 'archivo_url = ?, ';
    params.push(archivo_url);
  }
  
  // Eliminar la última coma y espacio
  sql = sql.slice(0, -2);
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  const result = await query(sql, params);
  return result.affectedRows;
};

// Eliminar un libro
const deleteLibro = async (id) => {
  const sql = 'DELETE FROM libros WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows;
};

// Buscar libros
const searchLibros = async (searchTerm) => {
  const sql = `
    SELECT l.*, g.nombre as genero_nombre, 
    (SELECT AVG(puntuacion) FROM valoraciones WHERE libro_id = l.id) as valoracion_promedio
    FROM libros l
    LEFT JOIN generos g ON l.genero_id = g.id
    WHERE l.titulo LIKE ? OR l.autor LIKE ? OR l.descripcion LIKE ? OR g.nombre LIKE ?
    ORDER BY l.fecha_subida DESC
  `;
  const param = `%${searchTerm}%`;
  return await query(sql, [param, param, param, param]);
};

// Obtener libros por género
const getLibrosByGenero = async (generoId) => {
  const sql = `
    SELECT l.*, g.nombre as genero_nombre, 
    (SELECT AVG(puntuacion) FROM valoraciones WHERE libro_id = l.id) as valoracion_promedio
    FROM libros l
    LEFT JOIN generos g ON l.genero_id = g.id
    WHERE l.genero_id = ?
    ORDER BY l.fecha_subida DESC
  `;
  return await query(sql, [generoId]);
};

module.exports = {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
  searchLibros,
  getLibrosByGenero
}; 