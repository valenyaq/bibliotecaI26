import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  
  // Imprimir información para depuración
  useEffect(() => {
    console.log("ProtectedRoute - Estado de autenticación:", {
      loading,
      user,
      isAuthenticated: isAuthenticated(),
      isAdmin: isAdmin()
    });
  }, [loading, user, isAuthenticated, isAdmin]);
  
  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }
  
  // Si no es admin, también redirigir al login
  if (!isAdmin()) {
    console.log("Usuario no es administrador, redirigiendo a inicio");
    return <Navigate to="/" replace />;
  }
  
  // Si el usuario está autenticado y es admin, mostrar el contenido
  return children;
};

export default ProtectedRoute; 