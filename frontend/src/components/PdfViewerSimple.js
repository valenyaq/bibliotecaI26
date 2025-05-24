import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente mejorado para visualizar PDFs usando iframe
 * Incluye navegación básica entre páginas sin la barra lateral
 */
const PdfViewerSimple = ({ url }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const iframeRef = useRef(null);

  // Inicializar comunicación con el iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Recibir mensajes del iframe (número total de páginas)
      if (event.data && event.data.type === 'pdf-loaded') {
        setTotalPages(event.data.totalPages);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Función para ir a la página anterior
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      sendCommandToIframe('prev-page');
    }
  };

  // Función para ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      sendCommandToIframe('next-page');
    }
  };

  // Enviar comando al iframe
  const sendCommandToIframe = (command) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ command }, '*');
    }
  };

  // Construir URL con parámetros para ocultar la barra lateral
  const getViewerUrl = () => {
    // Si la URL ya incluye un visor personalizado, usarla directamente
    if (url.includes('viewer.html') || url.includes('/api/libros/ver/')) {
      return `${url}#pagemode=none&sidebar=0`;
    }
    
    // Si es una URL normal, usar viewer.html para mostrarla sin barra lateral
    return `/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}#pagemode=none&sidebar=0`;
  };

  if (!url) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No se ha proporcionado ningún archivo PDF</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      
      <div className="relative w-full" style={{ height: '75vh' }}>
        <iframe
          ref={iframeRef}
          src={getViewerUrl()}
          className="absolute top-0 left-0 w-full h-full border-0 rounded-b-lg shadow-md"
          title="PDF Viewer"
        >
          Su navegador no soporta iframes. Puede descargar el PDF directamente.
        </iframe>
      </div>
    </div>
  );
};

export default PdfViewerSimple; 