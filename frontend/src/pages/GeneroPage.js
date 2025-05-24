import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLibrosByGenero } from '../services/librosService';
import { getGeneroById } from '../services/generosService';
import LibroCard from '../components/LibroCard';

const GeneroPage = () => {
  const { id } = useParams();
  const [libros, setLibros] = useState([]);
  const [genero, setGenero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [librosData, generoData] = await Promise.all([
          getLibrosByGenero(id),
          getGeneroById(id)
        ]);
        
        setLibros(librosData);
        setGenero(generoData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            &larr; Volver al inicio
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Libros de {genero?.nombre || 'este género'}
            </h1>
            
            {libros.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay libros disponibles para este género.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {libros.map(libro => (
                  <LibroCard key={libro.id} libro={libro} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GeneroPage; 