import React from 'react';
import { Link } from 'react-router-dom';
import { getPortadaUrl } from '../services/fileService';

const LibroCard = ({ libro }) => {
  const { id, titulo, autor, portada_url, genero_nombre, valoracion_promedio, num_paginas } = libro;

  // Imagen por defecto si no hay portada
  const imagenPorDefecto = '/placeholder-book.png';

  // Formatear la valoración
  const valoracion = valoracion_promedio ? parseFloat(valoracion_promedio).toFixed(1) : 'Sin valoraciones';  return (
    <div className="bg-white shadow-md overflow-hidden transition-all duration-200 hover:ring-1 hover:ring-black">
      <Link to={`/libro/${id}`} className="block h-full">
        <div className="relative pb-[140%]">
          <img 
            src={getPortadaUrl(portada_url, imagenPorDefecto)} 
            alt={titulo}
            className="absolute h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imagenPorDefecto;
            }}
          />
        </div>        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 truncate">{titulo}</h3>
          <p className="text-gray-600 text-sm">{autor}</p>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="bg-[#f5efd7] text-[#8a6d23] text-xs px-2 py-1 rounded-full">
              {genero_nombre || 'Sin género'}
            </span>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">{valoracion}</span>
            </div>
          </div>
          
          {num_paginas && (
            <div className="mt-3 text-sm text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>{num_paginas} páginas</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default LibroCard; 