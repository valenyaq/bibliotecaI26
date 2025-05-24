import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginAdmin, 
  logout as logoutService, 
  isAuthenticated as checkAuthenticated,
  isAdmin as checkAdmin,
  getCurrentUser
} from '../services/authService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (checkAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error al inicializar la autenticación:', err);
        setError('Error al inicializar la autenticación');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginAdmin(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Comprobar si es administrador
  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  // Comprobar si está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 