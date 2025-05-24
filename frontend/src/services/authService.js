import api from './api';

// Login del administrador
export const loginAdmin = async (credentials) => {
  try {
    console.log("Intentando iniciar sesión como admin con:", credentials);
    const response = await api.post('/admin/login', credentials);
    
    console.log("Respuesta del login:", response.data);
    
    // Guardar el token en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Verificar que el token se guardó correctamente
      const savedToken = localStorage.getItem('token');
      console.log("Token guardado correctamente:", !!savedToken);
    } else {
      console.error("No se recibió token en la respuesta del servidor");
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
  const result = !!token;
  console.log("isAuthenticated:", result, "token:", token ? "existe" : "no existe");
  return result;
};

// Verificar si el usuario es administrador
export const isAdmin = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log("isAdmin: false (no hay datos de usuario)");
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    const result = user.isAdmin === true;
    console.log("isAdmin:", result, "user:", user);
    return result;
  } catch (error) {
    console.error("Error al comprobar isAdmin:", error);
    return false;
  }
};

// Cerrar sesión
export const logout = () => {
  console.log("Cerrando sesión, eliminando token y datos de usuario");
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log("getCurrentUser: No hay datos de usuario");
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    console.log("getCurrentUser:", user);
    return user;
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
}; 