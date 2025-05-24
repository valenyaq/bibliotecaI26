import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PdfViewerSimple from '../components/PdfViewerSimple';
import { getPdfUrl, getPdfDownloadUrl } from '../services/fileService';

const LeerLibroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState(null);
  
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/libros/${id}`);
        setLibro(response.data);
        
        // Construir y guardar las URLs del PDF cuando el libro se carga
        if (response.data && response.data.archivo_url) {
          // Usar el servicio para obtener las URLs correctas
          const viewUrl = getPdfUrl(response.data.archivo_url);
          const downloadUrl = getPdfDownloadUrl(response.data.archivo_url);
          
          setPdfUrl(viewUrl);
          setPdfDownloadUrl(downloadUrl);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el libro:', err);
        setError('No se pudo cargar el libro. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchLibro();
  }, [id]);
  
  const handleReload = () => {
    window.location.reload();
  };
  
  const handleDescargarPdf = () => {
    if (pdfDownloadUrl) {
      window.open(pdfDownloadUrl, '_blank');
    }
  };

  const handleVolverAtras = () => {
    navigate(-1); // Vuelve a la página anterior en el historial
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
          className="flex items-center text-[#a2822b] hover:text-[#8a6d23] transition duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
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
          className="flex items-center text-[#a2822b] hover:text-[#8a6d23] transition duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver atrás
        </button>
      </div>
    );
  }
  
  // Si el libro no tiene archivo
  if (!libro.archivo_url) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-xl mb-4">Este libro no tiene un archivo disponible para lectura</div>
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
    );
  }
  
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
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{libro.titulo}</h1>
        <p className="text-gray-600">Autor: {libro.autor}</p>
      </div>
      
      <div className="w-full">
        <PdfViewerSimple url={pdfUrl} />
      </div>
    </div>
  );
};

export default LeerLibroPage; 