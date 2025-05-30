import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllLibros } from '../services/librosService';
import LibroCard from '../components/LibroCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('term') || '';
  
  const [libros, setLibros] = useState([]);
  const [filteredLibros, setFilteredLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setLoading(true);
        const data = await getAllLibros();
        setLibros(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los libros:', err);
        setError('No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  useEffect(() => {
    if (searchTerm && libros.length > 0) {
      // Convertir el término de búsqueda a minúsculas y eliminar acentos
      const normalizedSearchTerm = searchTerm.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      // Filtrar libros que coincidan parcialmente con el término de búsqueda
      // solo en título o autor
      const filtered = libros.filter(libro => {
        const normalizedTitulo = libro.titulo.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        
        const normalizedAutor = libro.autor.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        
        // Verificar si el término de búsqueda aparece en título o autor
        return normalizedTitulo.includes(normalizedSearchTerm) || 
               normalizedAutor.includes(normalizedSearchTerm);
      });
      
      setFilteredLibros(filtered);
    } else {
      setFilteredLibros([]);
    }
  }, [searchTerm, libros]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Resultados de búsqueda: "{searchTerm}"
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredLibros.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">
              No se encontraron libros que coincidan con "{searchTerm}".
            </p>
            <p className="text-gray-500 mt-2">
              Intenta con otros términos de búsqueda o navega por nuestras categorías.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Se encontraron {filteredLibros.length} {filteredLibros.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredLibros.map(libro => (
                <LibroCard key={libro.id} libro={libro} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 