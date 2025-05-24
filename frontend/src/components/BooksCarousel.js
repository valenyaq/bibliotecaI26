import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { getPortadaUrl } from '../services/fileService';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BooksCarousel = ({ books }) => {
  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: books.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Imagen por defecto si no hay portada
  const defaultImage = '/placeholder-book.png';

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Libros Recientes
      </h2>
      
      {books.length > 0 ? (
        <Slider {...settings}>
          {books.map((book) => (
            <div key={book.id} className="px-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:shadow-xl hover:scale-105">
                <Link to={`/libro/${book.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getPortadaUrl(book.portada_url, defaultImage)}
                      alt={book.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{book.titulo}</h3>
                    <p className="text-sm text-gray-600">{book.autor}</p>
                    
                    <div className="mt-3 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(book.valoracion_promedio || 0) 
                              ? "text-yellow-500" 
                              : "text-gray-300"}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">
                          {book.valoracion_promedio 
                            ? parseFloat(book.valoracion_promedio).toFixed(1) 
                            : "Sin valoraciones"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay libros disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default BooksCarousel; 