import React, { useState, useEffect } from 'react';
import { getAllLibros, deleteLibro } from '../../services/librosService';
import LibroForm from '../../components/admin/LibroForm';

const LibrosAdminPage = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentLibro, setCurrentLibro] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar libros al montar el componente
  useEffect(() => {
    fetchLibros();
  }, []);

  // Función para cargar libros
  const fetchLibros = async () => {
    try {
      setLoading(true);
      const data = await getAllLibros();
      setLibros(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar libros:', err);
      setError('Error al cargar libros. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un libro
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.')) {
      try {
        await deleteLibro(id);
        setSuccessMessage('Libro eliminado correctamente');
        
        // Actualizar la lista de libros
        fetchLibros();
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error al eliminar libro:', err);
        setError('Error al eliminar el libro');
      }
    }
  };

  // Función para editar un libro
  const handleEdit = (libro) => {
    setCurrentLibro(libro);
    setShowForm(true);
    window.scrollTo(0, 0); // Desplazarse al inicio para ver el formulario
  };

  // Función para manejar el éxito al guardar libro
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentLibro(null);
    
    // Mostrar mensaje de éxito
    setSuccessMessage(currentLibro ? 'Libro actualizado correctamente' : 'Libro creado correctamente');
    
    // Actualizar la lista de libros
    fetchLibros();
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Función para cancelar el formulario
  const handleCancel = () => {
    setShowForm(false);
    setCurrentLibro(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado y botón para agregar libro */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administrar Libros</h1>
        <button
          onClick={() => {
            setCurrentLibro(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm && !currentLibro ? 'Cancelar' : 'Agregar Libro'}
        </button>
      </div>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulario para agregar/editar libro */}
      {showForm && (
        <div className="mb-8">
          <LibroForm
            libro={currentLibro}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Tabla de libros */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portada
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Género
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : libros.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No hay libros disponibles
                </td>
              </tr>
            ) : (
              libros.map((libro) => (
                <tr key={libro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {libro.portada_url ? (
                      <img
                        src={`http://localhost:3001${libro.portada_url}`}
                        alt={libro.titulo}
                        className="h-16 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-12 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-xs text-gray-500">Sin imagen</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{libro.titulo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{libro.autor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{libro.genero_nombre || 'Sin género'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(libro)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(libro.id)}
                      className="text-red-600 hover:text-red-900"
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

export default LibrosAdminPage; 