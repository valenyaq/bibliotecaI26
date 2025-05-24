import api from './api';

// Obtener todos los géneros
export const getAllGeneros = async () => {
  try {
    const response = await api.get('/generos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener un género por su ID
export const getGeneroById = async (id) => {
  try {
    const response = await api.get(`/generos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un género (sólo admin)
export const createGenero = async (nombre) => {
  try {
    const response = await api.post('/generos', { nombre });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar un género (sólo admin)
export const updateGenero = async (id, nombre) => {
  try {
    const response = await api.put(`/generos/${id}`, { nombre });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un género (sólo admin)
export const deleteGenero = async (id) => {
  try {
    const response = await api.delete(`/generos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 