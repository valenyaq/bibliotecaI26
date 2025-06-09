import api from './api';

// Obtener todos los libros
export const getAllLibros = async () => {
  try {
    const response = await api.get('/libros');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener un libro por su ID
export const getLibroById = async (id) => {
  try {
    const response = await api.get(`/libros/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar libros
export const searchLibros = async (term) => {
  try {
    const response = await api.get(`/libros/search?term=${term}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener libros por género
export const getLibrosByGenero = async (generoId) => {
  try {
    const response = await api.get(`/libros/genero/${generoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un libro (sólo admin)
export const createLibro = async (libroData) => {
  try {
    const formData = new FormData();
    
    // Añadir datos del libro al FormData
    formData.append('titulo', libroData.titulo);
    formData.append('autor', libroData.autor);
    formData.append('descripcion', libroData.descripcion);
    formData.append('genero_id', libroData.genero_id);
    
    // Añadir archivos si existen
    if (libroData.portada) {
      formData.append('portada', libroData.portada);
    }
    
    if (libroData.archivo) {
      formData.append('archivo', libroData.archivo);
    }
    
    const response = await api.post('/libros', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar un libro (sólo admin)
export const updateLibro = async (id, libroData) => {
  try {
    const formData = new FormData();
    
    // Añadir datos del libro al FormData si existen
    if (libroData.titulo) {
      formData.append('titulo', libroData.titulo);
    }
    
    if (libroData.autor) {
      formData.append('autor', libroData.autor);
    }
    
    if (libroData.descripcion !== undefined) {
      formData.append('descripcion', libroData.descripcion);
    }
    
    if (libroData.genero_id) {
      formData.append('genero_id', libroData.genero_id);
    }
    
    // Añadir archivos si existen
    if (libroData.portada) {
      formData.append('portada', libroData.portada);
    }
    
    if (libroData.archivo) {
      formData.append('archivo', libroData.archivo);
    }
    
    const response = await api.put(`/libros/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un libro (sólo admin)
export const deleteLibro = async (id) => {
  try {
    const response = await api.delete(`/libros/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener libros paginados
export const getLibrosPaginados = async (page = 1, limit = 12, ordenar = 'fecha_desc') => {
  try {
    const response = await api.get(`/libros/paginados?page=${page}&limit=${limit}&ordenar=${ordenar}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener libros por género paginados
export const getLibrosByGeneroPaginados = async (generoId, page = 1, limit = 12, ordenar = 'fecha_desc') => {
  try {
    const response = await api.get(`/libros/genero/${generoId}/paginados?page=${page}&limit=${limit}&ordenar=${ordenar}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 