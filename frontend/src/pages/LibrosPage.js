import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLibrosPaginados, getLibrosByGeneroPaginados } from '../services/librosService';
import { getAllGeneros } from '../services/generosService';
import LibroCard from '../components/LibroCard';

const LibrosPage = () => {
  const [libros, setLibros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Obtener parámetros de la URL
  const generoId = searchParams.get('genero') || '';
  const ordenar = searchParams.get('ordenar') || 'fecha_desc';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los géneros
        const generosData = await getAllGeneros();
        setGeneros(generosData);
        
        // Obtener libros según el filtro de género y ordenación
        let response;
        if (generoId) {
          response = await getLibrosByGeneroPaginados(generoId, page, pagination.itemsPerPage, ordenar);
        } else {
          response = await getLibrosPaginados(page, pagination.itemsPerPage, ordenar);
        }
        
        // Los libros ya vienen ordenados del backend
        setLibros(response.libros);
        
        // Actualizar información de paginación
        setPagination(prevPagination => ({
          ...prevPagination,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems
        }));
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [generoId, ordenar, page, pagination.itemsPerPage]);
  
  // Actualizar parámetros de búsqueda
  const handleFilterChange = (parametro, valor) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (valor) {
      newParams.set(parametro, valor);
    } else {
      newParams.delete(parametro);
    }
    
    // Resetear a la primera página cuando cambian los filtros (excepto si cambia la página misma)
    if (parametro !== 'page') {
        newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  };
  
  // Manejar cambio de género
  const handleGeneroChange = (e) => {
    handleFilterChange('genero', e.target.value);
  };
  
  // Manejar cambio de ordenamiento
  const handleOrdenarChange = (e) => {
    handleFilterChange('ordenar', e.target.value);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
      // Asegurarse de que la nueva página esté dentro del rango válido
      if (newPage >= 1 && newPage <= pagination.totalPages) {
          handleFilterChange('page', newPage.toString());
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Biblioteca de Libros
        </h1>
        
        {/* Filtros y opciones de ordenamiento */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Género
              </label>
              <div className="relative">
                <select
                  id="genero"
                  value={generoId}
                  onChange={handleGeneroChange}
                  className="block w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a2822b] focus:border-transparent transition duration-300"
                >
                  <option value="">Todos los géneros</option>
                  {generos.map(genero => (
                    <option key={genero.id} value={genero.id}>
                      {genero.nombre}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#a2822b]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="ordenar" className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <div className="relative">
                <select
                  id="ordenar"
                  value={ordenar}
                  onChange={handleOrdenarChange}
                  className="block w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a2822b] focus:border-transparent transition duration-300"
                >
                  <option value="fecha_desc">Más recientes primero</option>
                  <option value="fecha_asc">Más antiguos primero</option>
                  <option value="titulo_asc">Título (A-Z)</option>
                  <option value="titulo_desc">Título (Z-A)</option>
                  <option value="autor_asc">Autor (A-Z)</option>
                  <option value="autor_desc">Autor (Z-A)</option>
                  <option value="valoracion_desc">Mejor valorados</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#a2822b]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Listado de libros */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a2822b]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
            {error}
          </div>
        ) : libros.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md border border-gray-100">
            <p className="text-gray-600">No hay libros disponibles con los filtros seleccionados.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Mostrando {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
                {generoId && generos.find(g => g.id.toString() === generoId) ? 
                  ` del género "${generos.find(g => g.id.toString() === generoId).nombre}"` : 
                  ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {libros.map(libro => (
                <LibroCard key={libro.id} libro={libro} />
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4 4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      aria-current={pagination.currentPage === index + 1 ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.currentPage === index + 1
                          ? 'z-10 bg-[#a2822b] border-[#a2822b] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibrosPage; 