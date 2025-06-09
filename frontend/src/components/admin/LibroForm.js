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
    
    // Validar tipo de archivo
    if (name === 'portada' && !file.type.startsWith('image/')) {
      setError('El archivo seleccionado para la portada no es una imagen válida');
      // Limpiar el input de archivo
      e.target.value = '';
      return;
    }
    
    if (name === 'archivo' && file.type !== 'application/pdf') {
      setError('El archivo seleccionado debe ser un PDF');
      // Limpiar el input de archivo
      e.target.value = '';
      return;
    }
    
    // Si el archivo es válido, limpiar el mensaje de error
    setError(null);
    
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
    
    // Validaciones adicionales antes de enviar
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    if (!formData.autor.trim()) {
      setError('El autor es obligatorio');
      return;
    }
    
    // Si es un nuevo libro, validar que se hayan subido los archivos necesarios
    if (!libro && !formData.portada) {
      setError('Debes seleccionar una imagen para la portada');
      return;
    }
    
    if (!libro && !formData.archivo) {
      setError('Debes seleccionar un archivo PDF del libro');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Verificar el token antes de enviar
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }
      
      if (libro) {
        // Actualizar libro existente
        const result = await updateLibro(libro.id, formData);
        console.log("Libro actualizado correctamente");
      } else {
        // Crear nuevo libro
        const result = await createLibro(formData);
        console.log("Libro creado correctamente");
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
        
        // Limpiar los inputs de archivo
        const portadaInput = document.querySelector('input[name="portada"]');
        const archivoInput = document.querySelector('input[name="archivo"]');
        if (portadaInput) portadaInput.value = '';
        if (archivoInput) archivoInput.value = '';
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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 flex flex-col items-center justify-center relative bg-gray-100 rounded-lg border border-gray-300 p-4 min-h-[300px]">
            {previewPortada ? (
              <img
                src={previewPortada}
                alt="Vista previa de portada"
                className="max-h-80 object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="text-gray-500 text-center flex flex-col items-center justify-center h-full">
                <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="mt-2 block text-base font-medium">No hay imagen seleccionada</span>
              </div>
            )}
            <label htmlFor="portada" className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg">
              <span className="text-white text-lg font-semibold mb-2">Seleccionar Portada</span>
              <span className="text-white text-sm">({portadaFileName || 'Ningún archivo'})</span>
              <input
                id="portada"
                type="file"
                name="portada"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 gap-6">
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
            
            <div className="md:col-span-1">
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