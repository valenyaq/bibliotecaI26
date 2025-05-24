import api from './api';

// Obtener comentarios de un libro
export const getComentariosByLibroId = async (libroId) => {
  try {
    const response = await api.get(`/comentarios/libro/${libroId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo comentario
export const createComentario = async (comentarioData) => {
  try {
    const response = await api.post('/comentarios', comentarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un comentario
export const deleteComentario = async (id) => {
  try {
    const response = await api.delete(`/comentarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 