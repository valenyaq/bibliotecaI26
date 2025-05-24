import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  // Cerrar los menús desplegables al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAdminDropdownOpen(false);
  }, [location.pathname]);

  // Detectar si la ruta actual es de administración
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#a2822b] to-[#8a6d23] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/admin" className="flex items-center">
              <img 
                src="/logo-isfdt26.png" 
                alt="Logo ISFDyT 26" 
                className="h-8 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>';
                }}
              />
              <span className="font-bold text-xl">Panel Administrador</span>
            </Link>
            <span className="mx-4 text-gray-200">|</span>
            <Link to="/" className="text-gray-200 hover:text-white transition duration-300">
              Ver sitio
            </Link>
          </div>

          {/* Menú de navegación (escritorio) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md font-medium transition duration-300 ${
                location.pathname === '/admin' 
                  ? 'bg-[#8a6d23] text-white' 
                  : 'text-gray-100 hover:bg-[#8a6d23] hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            
            {/* Menú desplegable de administración */}
            <div className="relative">
              <button 
                onClick={toggleAdminDropdown}
                className={`flex items-center px-3 py-2 rounded-md font-medium transition duration-300 ${
                  isAdminRoute && location.pathname !== '/admin'
                    ? 'bg-[#8a6d23] text-white' 
                    : 'text-gray-100 hover:bg-[#8a6d23] hover:text-white'
                }`}
              >
                Administrar
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`ml-2 h-5 w-5 transition-transform duration-300 ${isAdminDropdownOpen ? 'transform rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Menú desplegable */}
              {isAdminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-fadeIn">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/admin/libros"
                      className={`block px-4 py-2 text-sm ${
                        location.pathname === '/admin/libros'
                          ? 'bg-[#f5efd7] text-[#a2822b] font-medium'
                          : 'text-gray-700 hover:bg-[#f5efd7] hover:text-[#a2822b]'
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Gestionar Libros
                      </div>
                    </Link>
                    
                    <Link
                      to="/admin/generos"
                      className={`block px-4 py-2 text-sm ${
                        location.pathname === '/admin/generos'
                          ? 'bg-[#f5efd7] text-[#a2822b] font-medium'
                          : 'text-gray-700 hover:bg-[#f5efd7] hover:text-[#a2822b]'
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Gestionar Géneros
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md font-medium transform hover:scale-105 transition duration-300"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#8a6d23] focus:outline-none transition duration-300"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil - lateral con animación */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#a2822b] shadow-xl transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-white hover:bg-[#8a6d23] p-2 rounded-md transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-2 h-full overflow-y-auto">
          <Link 
            to="/admin" 
            className={`block px-3 py-2 rounded-md text-base font-medium mb-2 ${
              location.pathname === '/admin' 
                ? 'bg-[#8a6d23] text-white' 
                : 'text-gray-200 hover:bg-[#8a6d23] hover:text-white'
            }`}
          >
            Dashboard
          </Link>
          
          <div className="border-t border-[#8a6d23] my-2"></div>
          <div className="px-3 py-1 text-xs uppercase font-semibold text-gray-200">
            Administración
          </div>
          
          <Link 
            to="/admin/libros" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/admin/libros' 
                ? 'bg-[#8a6d23] text-white' 
                : 'text-gray-200 hover:bg-[#8a6d23] hover:text-white'
            }`}
          >
            Gestionar Libros
          </Link>
          
          <Link 
            to="/admin/generos" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/admin/generos' 
                ? 'bg-[#8a6d23] text-white' 
                : 'text-gray-200 hover:bg-[#8a6d23] hover:text-white'
            }`}
          >
            Gestionar Géneros
          </Link>
          
          <div className="border-t border-[#8a6d23] my-2"></div>
          
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-[#8a6d23] hover:text-white"
          >
            Ver sitio
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 mt-4"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </nav>
  );
};

export default AdminNavbar; 