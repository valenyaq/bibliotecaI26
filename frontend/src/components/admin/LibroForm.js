import React, { useState, useEffect } from 'react';
import { createLibro, updateLibro } from '../../services/librosService';
import { getAllGeneros } from '../../services/generosService';

const LibroForm = ({ libro, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    descripcion: '',
    genero_id: '',
    portada: null,
    archivo: null
  });
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewPortada, setPreviewPortada] = useState(null);
  const [portadaFileName, setPortadaFileName] = useState('');
  const [archivoFileName, setArchivoFileName] = useState('');

  // Cargar géneros al montar el componente
  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const data = await getAllGeneros();
        setGeneros(data);
      } catch (err) {
        console.error('Error al cargar géneros:', err);
        setError('No se pudieron cargar los géneros');
      }
    };

    fetchGeneros();
  }, []);

  // Si se proporciona un libro para editar, cargar sus datos
  useEffect(() => {
    if (libro) {
      setFormData({
        titulo: libro.titulo || '',
        autor: libro.autor || '',
        descripcion: libro.descripcion || '',
        genero_id: libro.genero_id || '',
        portada: null,
        archivo: null
      });
      
      // Si el libro tiene portada, mostrar la URL
      if (libro.portada_url) {
        setPreviewPortada(`http://localhost:3001${libro.portada_url}`);
        const portadaName = libro.portada_url.split('/').pop();
        setPortadaFileName(portadaName || 'portada.jpg');
      }
      
      // Si hay archivo, mostrar nombre
      if (libro.archivo_url) {
        const archivoName = libro.archivo_url.split('/').pop();
        setArchivoFileName(archivoName || 'libro.pdf');
      }
    }
  }, [libro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;
    
    const file = files[0];
    
    setFormData({
      ...formData,
      [name]: file
    });
    
    // Si es una imagen, mostrar vista previa
    if (name === 'portada') {
      setPortadaFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewPortada(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (name === 'archivo') {
      setArchivoFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Mostrar información para depuración
      console.log("Datos del formulario a enviar:", formData);
      
      // Verificar el token antes de enviar
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }
      
      if (libro) {
        // Actualizar libro existente
        const result = await updateLibro(libro.id, formData);
        console.log("Respuesta de actualización:", result);
      } else {
        // Crear nuevo libro
        const result = await createLibro(formData);
        console.log("Respuesta de creación:", result);
      }
      
      // Notificar éxito
      if (onSuccess) {
        onSuccess();
      }
      
      // Resetear el formulario si es nuevo
      if (!libro) {
        setFormData({
          titulo: '',
          autor: '',
          descripcion: '',
          genero_id: '',
          portada: null,
          archivo: null
        });
        setPreviewPortada(null);
        setPortadaFileName('');
        setArchivoFileName('');
      }
    } catch (err) {
      console.error('Error al guardar libro:', err);
      let errorMsg = err.response?.data?.message || 'Error al guardar el libro';
      
      // Si es un error de autenticación, mostrar mensaje específico
      if (err.response?.status === 401) {
        errorMsg = 'Error de autenticación. Por favor, inicie sesión nuevamente.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {libro ? 'Editar Libro' : 'Agregar Nuevo Libro'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Género
            </label>
            <select
              name="genero_id"
              value={formData.genero_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar género</option>
              {generos.map(genero => (
                <option key={genero.id} value={genero.id}>
                  {genero.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Portada (Imagen)
            </label>
            <div className="flex items-center space-x-2">
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                <span>Seleccionar archivo</span>
                <input
                  type="file"
                  name="portada"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {portadaFileName || 'Ningún archivo seleccionado'}
              </span>
            </div>
            
            {previewPortada && (
              <div className="mt-3">
                <img 
                  src={previewPortada} 
                  alt="Vista previa" 
                  className="h-40 object-cover rounded border border-gray-300" 
                />
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Archivo PDF
            </label>
            <div className="flex items-center space-x-2">
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                <span>Seleccionar archivo</span>
                <input
                  type="file"
                  name="archivo"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {archivoFileName || 'Ningún archivo seleccionado'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (libro ? 'Actualizar Libro' : 'Crear Libro')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LibroForm; 