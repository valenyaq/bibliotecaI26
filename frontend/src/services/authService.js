import api from './api';

// Login del administrador
export const loginAdmin = async (credentials) => {
  try {
    // Validar datos antes de enviar
    if (!credentials.username || !credentials.password) {
      throw new Error('El nombre de usuario y la contraseña son obligatorios');
    }
    
    if (credentials.username.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }
    
    if (credentials.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    
    console.log("Iniciando proceso de autenticación");
    const response = await api.post('/admin/login', credentials);
    
    console.log("Autenticación completada");
    
    // Guardar el token en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log("Sesión iniciada correctamente");
    } else {
      console.error("Error en la respuesta de autenticación");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error en loginAdmin:", error);
    throw error;
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Verificar si el usuario es administrador
export const isAdmin = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    return user.isAdmin === true;
  } catch (error) {
    console.error("Error al procesar datos de usuario");
    return false;
  }
};

// Cerrar sesión
export const logout = () => {
  console.log("Cerrando sesión");
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error al procesar datos de usuario");
    return null;
  }
};