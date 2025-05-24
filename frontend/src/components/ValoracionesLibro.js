import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { getValoracionesByLibroId, createValoracion, getValoracionPromedio } from '../services/valoracionesService';

const ValoracionesLibro = ({ libroId }) => {
  const [valoraciones, setValoraciones] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comentario, setComentario] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Cargar valoraciones al montar el componente
  useEffect(() => {
    const fetchValoraciones = async () => {
      try {
        setLoading(true);
        setError(null); // Limpiar errores anteriores
        
        // Intentar obtener valoraciones
        try {
          const data = await getValoracionesByLibroId(libroId);
          setValoraciones(Array.isArray(data) ? data : []);
        } catch (err) {
          console.warn('No se pudieron cargar las valoraciones, usando array vacío:', err);
          setValoraciones([]);
        }
        
        // Intentar obtener promedio
        try {
          const promedioData = await getValoracionPromedio(libroId);
          setPromedio(promedioData || 0);
        } catch (err) {
          console.warn('No se pudo cargar el promedio, usando 0:', err);
          setPromedio(0);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error general al cargar datos:', err);
        setError('No se pudieron cargar las valoraciones');
        setValoraciones([]);
        setPromedio(0);
        setLoading(false);
      }
    };

    if (libroId) {
      fetchValoraciones();
    }
  }, [libroId]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos
    
    if (userRating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    
    if (!nombreUsuario.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    
    try {
      setEnviando(true);
      
      // Crear objeto de valoración
      const valoracionData = {
        libro_id: libroId,
        puntuacion: userRating,
        comentario: comentario.trim(),
        nombre_usuario: nombreUsuario.trim()
      };
      
      // Enviar valoración
      await createValoracion(valoracionData);
      
      // Actualizar datos
      try {
        const data = await getValoracionesByLibroId(libroId);
        setValoraciones(Array.isArray(data) ? data : []);
      } catch (updateErr) {
        console.warn('Error al actualizar valoraciones:', updateErr);
        // Agregar la nueva valoración manualmente al array local
        const nuevaValoracion = {
          id: Date.now(), // ID temporal
          libro_id: libroId,
          puntuacion: userRating,
          comentario: comentario.trim(),
          nombre_usuario: nombreUsuario.trim(),
          fecha: new Date().toISOString()
        };
        setValoraciones(prev => [nuevaValoracion, ...prev]);
      }
      
      try {
        const promedioData = await getValoracionPromedio(libroId);
        setPromedio(promedioData || 0);
      } catch (updateErr) {
        console.warn('Error al actualizar promedio:', updateErr);
        // Calcular promedio manualmente
        const totalPuntos = valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) + userRating;
        const nuevaCantidad = valoraciones.length + 1;
        setPromedio(totalPuntos / nuevaCantidad);
      }
      
      // Limpiar formulario
      setUserRating(0);
      setComentario('');
      setSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error al enviar valoración:', err);
      setError('No se pudo enviar la valoración. Inténtalo de nuevo más tarde.');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Valoraciones</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a2822b] mr-3"></div>
          <span>Cargando valoraciones...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Valoraciones</h2>
      
      {/* Mostrar mensaje de error si existe, pero no bloquear el resto del componente */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {/* Título y promedio de valoraciones */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Valoraciones</h3>
        <div className="flex items-center mb-2">
          <div className="mr-2 font-semibold text-lg">Calificación promedio:</div>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={index}
                  className="mr-1"
                  size={24}
                  color={ratingValue <= Math.round(promedio) ? '#ffc107' : '#e4e5e9'}
                />
              );
            })}
            <span className="ml-2 text-lg font-medium">
              {promedio && !isNaN(parseFloat(promedio)) ? parseFloat(promedio).toFixed(1) : '0'} ({valoraciones.length} {valoraciones.length === 1 ? 'valoración' : 'valoraciones'})
            </span>
          </div>
        </div>
      </div>
      
      {/* Botón para mostrar/ocultar formulario */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="text-[#a2822b] hover:text-[#8a6d23] font-medium flex items-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            {mostrarFormulario ? (
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
          {mostrarFormulario ? 'Ocultar formulario' : 'Deja tu valoración'}
        </button>
      </div>
      
      {/* Formulario para nueva valoración */}
      {mostrarFormulario && (
        <div className="mb-8 p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Escribe tu valoración</h3>
          
          <form onSubmit={handleSubmit}>
          {/* Nombre del usuario */}
          <div className="mb-4">
            <label htmlFor="nombreUsuario" className="block text-gray-700 mb-2">Tu nombre:</label>
            <input
              type="text"
              id="nombreUsuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full px-3 py-2 border border-[#a2822b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b]"
              required
            />
          </div>
          
          {/* Estrellas para calificar */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tu calificación:</label>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setUserRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      className="mr-1"
                      size={32}
                      color={ratingValue <= (hover || userRating) ? '#ffc107' : '#e4e5e9'}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* Comentario */}
          <div className="mb-4">
            <label htmlFor="comentario" className="block text-gray-700 mb-2">Tu comentario (opcional):</label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full px-3 py-2 border border-[#a2822b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b]"
              rows="4"
            ></textarea>
          </div>
          
          {/* Botón de envío */}
          <button
            type="submit"
            disabled={enviando}
            className="bg-[#a2822b] hover:bg-[#8a6d23] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            {enviando ? 'Enviando...' : 'Enviar valoración'}
          </button>
          
          {/* Mensaje de éxito */}
          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              ¡Gracias por tu valoración!
            </div>
          )}
        </form>
      </div>
      )}
      
      {/* Lista de valoraciones */}
      <div>
        
        {valoraciones.length === 0 ? (
          <p className="text-gray-600">{error ? 'No se pudieron cargar las valoraciones. Puedes ser el primero en valorar este libro.' : 'Aún no hay valoraciones para este libro. ¡Sé el primero en valorar!'}</p>
        ) : (
          <div className="space-y-4">
            {valoraciones.map((valoracion) => (
              <div key={valoracion.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{valoracion.nombre_usuario || 'Usuario anónimo'}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <FaStar
                          key={index}
                          className="mr-1"
                          size={16}
                          color={ratingValue <= valoracion.puntuacion ? '#ffc107' : '#e4e5e9'}
                        />
                      );
                    })}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(valoracion.fecha).toLocaleDateString()}
                  </span>
                </div>
                {valoracion.comentario && (
                  <p className="text-gray-700">{valoracion.comentario}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValoracionesLibro;
