import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLibros, getLibrosByGenero } from '../services/librosService';
import { getAllGeneros } from '../services/generosService';
import BooksCarousel from '../components/BooksCarousel';
import LibroCard from '../components/LibroCard';

const HomePage = () => {
  const [librosRecientes, setLibrosRecientes] = useState([]);
  const [librosPorGenero, setLibrosPorGenero] = useState({});
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generosDestacados, setGenerosDestacados] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [librosData, generosData] = await Promise.all([
          getAllLibros(),
          getAllGeneros()
        ]);
        
        // Obtener los 10 libros más recientes para el carrusel
        setLibrosRecientes(librosData.slice(0, 10));
        
        // Seleccionar algunos géneros destacados (máximo 4)
        const destacados = generosData.slice(0, 4);
        setGenerosDestacados(destacados);
        
        // Almacenar todos los géneros para el filtro
        setGeneros(generosData);
        
        // Crear un objeto con libros por género
        const librosPorGeneroObj = {};
        
        // Para cada género destacado, obtener sus libros
        await Promise.all(
          destacados.map(async (genero) => {
            try {
              const librosDeGenero = await getLibrosByGenero(genero.id);
              // Guardar solo los primeros 5 libros de cada género
              librosPorGeneroObj[genero.id] = librosDeGenero.slice(0, 5);
            } catch (err) {
              console.error(`Error al cargar libros del género ${genero.nombre}:`, err);
            }
          })
        );
        
        setLibrosPorGenero(librosPorGeneroObj);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner principal moderno */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between py-16 md:py-24">
            <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                <span className="block font-serif italic animate-fadeIn">Tu mundo literario</span>
                <span className="block mt-2 text-gray-700 animate-fadeIn animate-delay-200">a un clic de distancia</span>
              </h1>
              <p className="mt-5 max-w-md mx-auto md:mx-0 text-xl text-gray-600 animate-fadeIn animate-delay-300">
                Explora, lee y descubre nuevos horizontes a través de nuestra colección digital.
              </p>
              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  to="/libros"
                  className="px-8 py-3 rounded-full bg-[#a2822b] text-white font-medium hover:bg-[#8a6d23] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-scaleIn animate-delay-400 animate-pulse-custom"
                >
                  Explorar Biblioteca
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-slideInRight">
              <div className="relative h-64 w-64 md:h-96 md:w-96 animate-float">
                <div className="absolute top-0 left-0 h-full w-full transform rotate-6 rounded-2xl bg-gradient-to-r from-[#a2822b] to-[#8a6d23] shadow-xl"></div>
                <div className="absolute top-0 left-0 h-full w-full transform -rotate-3 rounded-2xl bg-white overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                    alt="Libros"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="white"
              fillOpacity="1"
              d="M0,128L80,149.3C160,171,320,213,480,224C640,235,800,213,960,181.3C1120,149,1280,107,1360,85.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sección de libros recientes (carrusel) */}
        {loading && librosRecientes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a2822b]"></div>
          </div>
        ) : error && librosRecientes.length === 0 ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow">
            {error}
          </div>
        ) : (
          <div className="animate-fadeIn">
            <BooksCarousel books={librosRecientes} />
          </div>
        )}

        {/* Secciones por género */}
        {!loading && generosDestacados.length > 0 && (
          <div className="mt-12 space-y-16">
            {generosDestacados.map((genero, index) => (
              <div key={genero.id} className={`mb-8 animate-fadeIn animate-delay-${(index + 1) * 100}`}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 relative">
                    <span className="relative z-10">{genero.nombre}</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#a2822b] opacity-50 z-0 transform -rotate-1"></span>
                  </h2>
                  <Link
                    to={`/libros?genero=${genero.id}`}
                    className="text-[#a2822b] hover:text-[#8a6d23] flex items-center group"
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all duration-200">Ver todos</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                
                {librosPorGenero[genero.id] && librosPorGenero[genero.id].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {librosPorGenero[genero.id].map((libro, libroIndex) => (
                      <div key={libro.id} className={`animate-scaleIn animate-delay-${(libroIndex % 5) * 100}`}>
                        <LibroCard libro={libro} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">No hay libros disponibles para este género.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 