const generoModel = require('../models/genero.model');

// Obtener todos los géneros
const getAllGeneros = async (req, res) => {
  try {
    const generos = await generoModel.getAllGeneros();
    res.json(generos);
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los géneros',
      error: error.message
    });
  }
};

// Obtener un género por su ID
const getGeneroById = async (req, res) => {
  try {
    const id = req.params.id;
    const genero = await generoModel.getGeneroById(id);
    
    if (!genero) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontró género con ID: ${id}` 
      });
    }
    
    res.json(genero);
  } catch (error) {
    console.error(`Error al obtener género con ID ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el género',
      error: error.message
    });
  }
};

// Crear un nuevo género
const createGenero = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del género es requerido'
      });
    }
    
    const generoId = await generoModel.createGenero(nombre);
    res.status(201).json({
      success: true,
      message: 'Género creado correctamente',
      generoId
    });
  } catch (error) {
    console.error('Error al crear género:', error);
    // Si es error de duplicado (nombre de género ya existe)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un género con ese nombre'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el género',
      error: error.message
    });
  }
};

// Actualizar un género
const updateGenero = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del género es requerido'
      });
    }
    
    const genero = await generoModel.getGeneroById(id);
    
    if (!genero) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontró género con ID: ${id}` 
      });
    }
    
    const affectedRows = await generoModel.updateGenero(id, nombre);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se realizaron cambios en el género'
      });
    }
    
    res.json({
      success: true,
      message: 'Género actualizado correctamente'
    });
  } catch (error) {
    console.error(`Error al actualizar género con ID ${req.params.id}:`, error);
    // Si es error de duplicado (nombre de género ya existe)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un género con ese nombre'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el género',
      error: error.message
    });
  }
};

// Eliminar un género
const deleteGenero = async (req, res) => {
  try {
    const id = req.params.id;
    const genero = await generoModel.getGeneroById(id);
    
    if (!genero) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontró género con ID: ${id}` 
      });
    }
    
    const affectedRows = await generoModel.deleteGenero(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo eliminar el género'
      });
    }
    
    res.json({
      success: true,
      message: 'Género eliminado correctamente'
    });
  } catch (error) {
    console.error(`Error al eliminar género con ID ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el género',
      error: error.message
    });
  }
};

module.exports = {
  getAllGeneros,
  getGeneroById,
  createGenero,
  updateGenero,
  deleteGenero
}; 