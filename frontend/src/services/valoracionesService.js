import api from './api';

// Obtener valoraciones de un libro
export const getValoracionesByLibroId = async (libroId) => {
  try {
    const response = await api.get(`/libros/${libroId}/valoraciones`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear una nueva valoración
export const createValoracion = async (valoracionData) => {
  try {
    const response = await api.post(`/libros/${valoracionData.libro_id}/valoraciones`, valoracionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener la valoración promedio de un libro
export const getValoracionPromedio = async (libroId) => {
  try {
    const response = await api.get(`/libros/${libroId}/valoraciones/promedio`);
    return response.data;
  } catch (error) {
    throw error;
  }
};