import React, { useState, useEffect } from 'react';
import { getAllGeneros, createGenero, updateGenero, deleteGenero } from '../../services/generosService';

const GenerosAdminPage = () => {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentGenero, setCurrentGenero] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [nombre, setNombre] = useState('');

  // Cargar géneros al montar el componente
  useEffect(() => {
    fetchGeneros();
  }, []);

  // Función para cargar géneros
  const fetchGeneros = async () => {
    try {
      setLoading(true);
      const data = await getAllGeneros();
      setGeneros(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar géneros:', err);
      setError('Error al cargar géneros. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar un género (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre del género es obligatorio');
      return;
    }
    
    try {
      if (currentGenero) {
        // Actualizar género existente
        await updateGenero(currentGenero.id, nombre);
        setSuccessMessage('Género actualizado correctamente');
      } else {
        // Crear nuevo género
        await createGenero(nombre);
        setSuccessMessage('Género creado correctamente');
      }
      
      // Limpiar formulario
      setNombre('');
      setShowForm(false);
      setCurrentGenero(null);
      
      // Actualizar lista de géneros
      fetchGeneros();
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error al guardar género:', err);
      setError('Error al guardar el género');
    }
  };

  // Función para eliminar un género
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este género? Esta acción puede afectar a todos los libros asociados.')) {
      try {
        await deleteGenero(id);
        setSuccessMessage('Género eliminado correctamente');
        
        // Actualizar la lista de géneros
        fetchGeneros();
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error al eliminar género:', err);
        setError('Error al eliminar el género');
      }
    }
  };

  // Función para editar un género
  const handleEdit = (genero) => {
    setCurrentGenero(genero);
    setNombre(genero.nombre);
    setShowForm(true);
    window.scrollTo(0, 0); // Desplazarse al inicio para ver el formulario
  };

  // Función para cancelar el formulario
  const handleCancel = () => {
    setShowForm(false);
    setCurrentGenero(null);
    setNombre('');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado y botón para agregar género */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administrar Géneros</h1>
        <button
          onClick={() => {
            if (showForm && !currentGenero) {
              handleCancel();
            } else {
              setCurrentGenero(null);
              setNombre('');
              setShowForm(true);
            }
          }}
          className="px-4 py-2 bg-[#a2822b] text-white rounded-lg hover:bg-[#8a6d23] transition duration-300"
        >
          {showForm && !currentGenero ? 'Cancelar' : 'Agregar Género'}
        </button>
      </div>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-fadeIn">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fadeIn">
          {error}
        </div>
      )}

      {/* Formulario para agregar/editar género */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md animate-scaleIn">
          <h2 className="text-xl font-semibold mb-4">
            {currentGenero ? 'Editar Género' : 'Nuevo Género'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Género
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b]"
                placeholder="Ejemplo: Ciencia Ficción"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#a2822b] text-white rounded-md hover:bg-[#8a6d23] transition duration-300"
              >
                {currentGenero ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de géneros */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a2822b]"></div>
                  </div>
                </td>
              </tr>
            ) : generos.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No hay géneros disponibles
                </td>
              </tr>
            ) : (
              generos.map((genero) => (
                <tr key={genero.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{genero.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{genero.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(genero)}
                      className="text-[#a2822b] hover:text-[#8a6d23] mr-4 transition duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(genero.id)}
                      className="text-red-600 hover:text-red-900 transition duration-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerosAdminPage; 