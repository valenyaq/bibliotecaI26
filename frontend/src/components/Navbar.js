import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Extraer término de búsqueda de la URL al cargar
  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      const term = params.get('term');
      if (term) {
        setSearchTerm(term);
      }
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
      // Cerrar la barra de búsqueda móvil si está abierta
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Cerrar la búsqueda si abrimos el menú
    if (!isMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Cerrar el menú si abrimos la búsqueda
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo y nombre */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              {/* Espacio para el logo del instituto */}
              <img 
                src="/logo-isfdt26.png" 
                alt="Logo ISFDyT 26" 
                className="h-10 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23a2822b" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>';
                }}
              />
              <span className="font-bold text-2xl text-gray-800">Biblioteca ISFDyT 26</span>
            </Link>
          </div>

          {/* Búsqueda (escritorio) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar libros..."
                className="w-full px-4 py-2 rounded-lg text-gray-800 border border-[#a2822b] focus:outline-none transition duration-300 focus:ring-2 focus:ring-[#a2822b]"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-[#a2822b] transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8a4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>

          {/* Menú de navegación (escritorio) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/libros" className="text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300">
                Libros
              </Link>
              <Link to="/acerca" className="text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300">
                Acerca de
              </Link>
              <Link to="/contacto" className="text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300">
                Contacto
              </Link>
              
              {isAdmin() && (
                <div className="relative group">
                  <button className="flex items-center text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300">
                    Admin <span className="ml-1">▼</span>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block animate-fadeIn">
                    <Link to="/admin/libros" className="block px-4 py-2 text-gray-800 hover:bg-[#a2822b] hover:text-white transition duration-200">
                      Administrar Libros
                    </Link>
                    <Link to="/admin/generos" className="block px-4 py-2 text-gray-800 hover:bg-[#a2822b] hover:text-white transition duration-200">
                      Administrar Géneros
                    </Link>
                    <Link to="/admin/usuarios" className="block px-4 py-2 text-gray-800 hover:bg-[#a2822b] hover:text-white transition duration-200">
                      Administrar Usuarios
                    </Link>
                  </div>
                </div>
              )}
              
              {isAuthenticated() && (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-medium transform hover:scale-105 transition duration-300"
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>

          {/* Botones móviles (búsqueda y menú) */}
          <div className="md:hidden flex items-center space-x-1">
            {/* Botón búsqueda móvil */}
            <button
              onClick={toggleSearch}
              className="p-2 rounded-md text-gray-800 hover:text-[#a2822b] focus:outline-none transition duration-300"
              aria-label="Buscar"
            >
              {!isSearchOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8a4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {/* Botón de menú */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-[#a2822b] focus:outline-none transition duration-300"
              aria-label="Menú principal"
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

      {/* Barra de búsqueda móvil emergente */}
      {isSearchOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200 shadow-lg animate-fadeIn">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar libros..."
                className="w-full px-4 py-2 rounded-lg text-gray-800 border border-[#a2822b] focus:outline-none transition duration-300 focus:ring-2 focus:ring-[#a2822b]"
                autoFocus
              />
              <div className="absolute right-0 top-0 h-full flex items-center">
                {searchTerm && (
                  <button
                    type="button"
                    className="px-2 text-gray-500"
                    onClick={() => setSearchTerm('')}
                    aria-label="Limpiar búsqueda"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-4 text-gray-600 hover:text-[#a2822b] transition duration-300"
                  aria-label="Realizar búsqueda"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8a4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menú móvil - lateral con animación */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white text-gray-800 shadow-xl transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-[#a2822b] p-2 rounded-md transition duration-300"
            aria-label="Cerrar menú"
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
            to="/libros" 
            className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Libros
          </Link>
          <Link 
            to="/acerca" 
            className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Acerca de la Institución
          </Link>
          <Link 
            to="/contacto" 
            className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </Link>
          <Link 
            to="/faq" 
            className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Preguntas Frecuentes
          </Link>
          
          {isAdmin() && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-3 py-1 text-xs uppercase font-semibold text-gray-600">
                Administración
              </div>
              <Link 
                to="/admin/libros" 
                className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Administrar Libros
              </Link>
              <Link 
                to="/admin/generos" 
                className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Administrar Géneros
              </Link>
              <Link 
                to="/admin/usuarios" 
                className="block text-gray-800 hover:text-[#a2822b] px-3 py-2 rounded-md font-medium transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Administrar Usuarios
              </Link>
            </>
          )}
          
          {isAuthenticated() && (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md font-medium transition duration-300 mt-4"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
      
      {/* Overlay solo para el menú lateral */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar; 