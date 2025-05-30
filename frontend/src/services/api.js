import axios from 'axios';

// Usar URL de la API en producción o la URL de desarrollo local
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://biblioteca-virtual-api.onrender.com/api' 
  : 'http://localhost:3001/api';

// Crear instancia de axios con URL base
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Asegurarse de no sobrescribir el Content-Type para FormData
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        // Mantener el Content-Type existente para FormData
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Error al preparar la solicitud');
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Error de respuesta: ${error.response.status}`);
      
      // Si recibimos un 401 (no autorizado), podría ser que el token expiró
      if (error.response.status === 401) {
        console.log('Sesión expirada o inválida');
        // Cerrar sesión automáticamente
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redireccionar al login si estamos en producción
        if (process.env.NODE_ENV === 'production') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('Error de conexión con el servidor');
    } else {
      console.error('Error en la configuración de la solicitud');
    }
    
    return Promise.reject(error);
  }
);

export default api; 