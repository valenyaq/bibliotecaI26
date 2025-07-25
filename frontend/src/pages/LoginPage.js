import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Validar campos cuando cambian
  useEffect(() => {
    validateUsername(username);
  }, [username]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  // Funciones de validación
  const validateUsername = (value) => {
    let error = '';
    if (!value.trim()) {
      error = 'El nombre de usuario es obligatorio';
    } else if (value.trim().length < 3) {
      error = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    setValidationErrors(prev => ({ ...prev, username: error }));
    return error === '';
  };

  const validatePassword = (value) => {
    let error = '';
    if (!value) {
      error = 'La contraseña es obligatoria';
    } else if (value.length < 8) {
      error = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setValidationErrors(prev => ({ ...prev, password: error }));
    return error === '';
  };

  // Validar todo el formulario
  const validateForm = () => {
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    return isUsernameValid && isPasswordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario completo antes de enviar
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await login({ username, password });
      navigate('/admin'); // Redirigir al dashboard en lugar de la página de libros
    } catch (err) {
      // Mostrar mensaje de error sin exponer detalles sensibles
      setError(
        err.response?.data?.message || 
        'Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión como Administrador
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede para gestionar la biblioteca virtual
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.username ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 