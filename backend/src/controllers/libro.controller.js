const libroModel = require('../models/libro.model');
const { testConnection } = require('../config/db');

// Obtener todos los libros
const getAllLibros = async (req, res) => {
  try {
    await testConnection(); // Verificar conexión a la BD
    const libros = await libroModel.getAllLibros();
    res.json(libros);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los libros',
      error: error.message
    });
  }
};

// Obtener un libro por su ID
const getLibroById = async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await libroModel.getLibroById(id);
    
    if (!libro) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontró libro con ID: ${id}` 
      });
    }
    
    res.json(libro);
  } catch (error) {
    console.error(`Error al obtener libro con ID ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el libro',
      error: error.message
    });
  }
};

// Buscar libros
const searchLibros = async (req, res) => {
  try {
    const term = req.query.term;
    
    if (!term) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere un término de búsqueda' 
      });
    }
    
    const libros = await libroModel.searchLibros(term);
    res.json(libros);
  } catch (error) {
    console.error(`Error al buscar libros con término "${req.query.term}":`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al buscar libros',
      error: error.message
    });
  }
};

// Obtener libros por género
const getLibrosByGenero = async (req, res) => {
  try {
    const generoId = req.params.id;
    const libros = await libroModel.getLibrosByGenero(generoId);
    res.json(libros);
  } catch (error) {
    console.error(`Error al obtener libros del género ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener libros por género',
      error: error.message
    });
  }
};

// Crear un nuevo libro
const createLibro = async (req, res) => {
  try {
    await testConnection();
    
    // Verificar que tenemos los datos necesarios
    if (!req.body.titulo || !req.body.autor) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos (título y autor)'
      });
    }

    // Log para debugging
    console.log('Datos recibidos:', {
      body: req.body,
      files: req.files
    });

    // Crear el libro
    const result = await libroModel.createLibro(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Libro creado exitosamente',
      data: {
        id: result,
        ...req.body
      }
    });
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el libro',
      error: error.message
    });
  }
};

// Actualizar un libro
const updateLibro = async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await libroModel.getLibroById(id);
    
    if (!libro) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontró libro con ID: ${id}` 
      });
    }
    
    const libroData = {
      titulo: req.body.titulo,
      autor: req.body.autor,
      descripcion: req.body.descripcion,
      genero_id: req.body.genero_id,
      portada_url: req.files?.portada ? `/uploads/portadas/${req.files.portada[0].filename}` : undefined,
      archivo_url: req.files?.archivo ? `/uploads/libros/${req.files.archivo[0].filename}` : undefined
    };
    
    const affectedRows = await libroModel.updateLibro(id, libroData);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se realizaron cambios en el libro'
      });
    }
    
    // Obtener el libro actualizado
    const libroActualizado = await libroModel.getLibroById(id);
    
    res.json({
      success: true,
      message: 'Libro actualizado correctamente',
      libro: libroActualizado
    });
  } catch (error) {
    console.error(`Error al actualizar libro con ID ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el libro',
      error: error.message
    });
  }
};

// Eliminar un libro
const deleteLibro = async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await libroModel.getLibroById(id);
    
    if (!libro) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontró libro con ID: ${id}` 
      });
    }
    
    const affectedRows = await libroModel.deleteLibro(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo eliminar el libro'
      });
    }
    
    res.json({
      success: true,
      message: 'Libro eliminado correctamente'
    });
  } catch (error) {
    console.error(`Error al eliminar libro con ID ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el libro',
      error: error.message
    });
  }
};

// Obtener libros paginados (nuevo controlador)
const getLibrosPaginados = async (req, res) => {
  try {
    await testConnection();
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const ordenar = req.query.ordenar || 'fecha_desc'; // Leer parámetro de ordenación
    
    const [libros, totalItems] = await Promise.all([
      libroModel.getLibrosPaginados(page, limit, ordenar), // Pasar parámetro de ordenación al modelo
      libroModel.getTotalLibros()
    ]);
    
    const totalPages = Math.ceil(totalItems / limit);
    
    res.json({
      libros,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      ordenar // Devolver el criterio de ordenación actual
    });
  } catch (error) {
    console.error('Error al obtener libros paginados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los libros',
      error: error.message
    });
  }
};

// Obtener libros por género paginados (nuevo controlador)
const getLibrosByGeneroPaginados = async (req, res) => {
  try {
    const generoId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const ordenar = req.query.ordenar || 'fecha_desc'; // Leer parámetro de ordenación
    
    const [libros, totalItems] = await Promise.all([
      libroModel.getLibrosByGeneroPaginados(generoId, page, limit, ordenar), // Pasar parámetro de ordenación al modelo
      libroModel.getTotalLibrosByGenero(generoId)
    ]);
    
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      libros,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      ordenar // Devolver el criterio de ordenación actual
    });
  } catch (error) {
    console.error(`Error al obtener libros paginados del género ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener libros por género',
      error: error.message
    });
  }
};

module.exports = {
  getAllLibros,
  getLibroById,
  searchLibros,
  getLibrosByGenero,
  createLibro,
  updateLibro,
  deleteLibro,
  getLibrosPaginados,
  getLibrosByGeneroPaginados
};