import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getPortadaUrl, getPdfDownloadUrl } from '../services/fileService';
import ValoracionesLibro from '../components/ValoracionesLibro';

const DetalleLibroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/libros/${id}`);
        setLibro(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el libro:', err);
        setError('No se pudo cargar el libro. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchLibro();
  }, [id]);
  
  // Función para formatear la fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Función para descargar el PDF
  const handleDescargarPdf = () => {
    if (libro && libro.archivo_url) {
      const downloadUrl = getPdfDownloadUrl(libro.archivo_url);
      window.open(downloadUrl, '_blank');
    }
  };

  // Función para volver atrás
  const handleVolverAtras = () => {
    navigate(-1); // Vuelve a la página anterior
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#a2822b]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <button 
          onClick={handleVolverAtras} 
          className="bg-[#a2822b] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#8a6d23] transition duration-300 transform hover:scale-105"
        >
          Volver atrás
        </button>
      </div>
    );
  }
  
  if (!libro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-xl mb-4">Libro no encontrado</div>
        <button 
          onClick={handleVolverAtras} 
          className="bg-[#a2822b] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#8a6d23] transition duration-300 transform hover:scale-105"
        >
          Volver atrás
        </button>
      </div>
    );
  }
  
  // Imagen por defecto si no hay portada
  const imagenPorDefecto = '/placeholder-book.png';
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button 
          onClick={handleVolverAtras} 
          className="flex items-center text-[#a2822b] hover:text-[#8a6d23] transition duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver atrás
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <div className="md:flex">
          {/* Imagen del libro */}
          <div className="md:w-1/3 p-4">
            <img 
              src={getPortadaUrl(libro.portada_url, imagenPorDefecto)} 
              alt={libro.titulo}
              className="w-full h-auto object-cover rounded-lg shadow transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imagenPorDefecto;
              }}
            />
            
            {/* Acciones */}
            <div className="mt-4 space-y-2">
              {libro.archivo_url && (
                <>
                  <Link 
                    to={`/leer/${libro.id}`}
                    className="block w-full bg-[#a2822b] hover:bg-[#8a6d23] text-white text-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Leer Libro
                  </Link>
                  <button 
                    onClick={handleDescargarPdf}
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Descargar Libro
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Información del libro */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{libro.titulo}</h1>
            <p className="text-xl text-gray-600 mb-4">{libro.autor}</p>
            
            <div className="flex items-center mb-4">
              <span className="bg-[#f5efd7] text-[#8a6d23] text-sm px-3 py-1 rounded-full mr-2">
                {libro.genero_nombre || 'Sin género'}
              </span>
              
              <div className="flex items-center ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">
                  {libro.valoracion_promedio 
                    ? parseFloat(libro.valoracion_promedio).toFixed(1) 
                    : 'Sin valoraciones'}
                </span>
              </div>

              {libro.num_paginas && (
                <div className="flex items-center ml-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">{libro.num_paginas} páginas</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-line">{libro.descripcion || 'Sin descripción disponible'}</p>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Añadido el: {formatearFecha(libro.fecha_subida)}</p>
              {libro.fecha_actualizacion && (
                <p>Última actualización: {formatearFecha(libro.fecha_actualizacion)}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Componente de valoraciones */}
        <ValoracionesLibro libroId={id} />
      </div>
    </div>
  );
};

export default DetalleLibroPage;