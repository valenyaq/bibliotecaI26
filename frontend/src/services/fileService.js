/**
 * Servicio para manejar URLs de archivos de manera consistente
 */

// URL base para acceder a los archivos estáticos
const BASE_URL = 'http://localhost:3001';

/**
 * Convierte una ruta de archivo relativa en una URL completa
 * @param {string} path - Ruta del archivo (puede ser relativa o absoluta)
 * @returns {string} URL completa para acceder al archivo
 */
export const getFileUrl = (path) => {
  if (!path) return null;

  // Si es una URL absoluta, devolverla sin cambios
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Asegurarse de que la ruta comience con /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Construir la URL completa
  return `${BASE_URL}${cleanPath}`;
};

/**
 * Obtiene la URL para una portada de libro
 * @param {string} portadaUrl - Ruta de la portada
 * @param {string} defaultImage - Imagen por defecto si no hay portada
 * @returns {string} URL de la portada
 */
export const getPortadaUrl = (portadaUrl, defaultImage = '/placeholder-book.png') => {
  return portadaUrl ? getFileUrl(portadaUrl) : defaultImage;
};

/**
 * Obtiene la URL para visualizar un archivo PDF
 * @param {string} archivoUrl - Ruta del archivo PDF
 * @returns {string|null} URL para visualizar el PDF o null si no hay archivo
 */
export const getPdfUrl = (archivoUrl) => {
  if (!archivoUrl) return null;
  return archivoUrl;
};

/**
 * Obtiene la URL para descargar un archivo PDF
 * @param {string} archivoUrl - Ruta del archivo PDF
 * @returns {string|null} URL para descargar el PDF o null si no hay archivo
 */
export const getPdfDownloadUrl = (archivoUrl) => {
  if (!archivoUrl) return null;
  return archivoUrl;
};

export default {
  getFileUrl,
  getPortadaUrl,
  getPdfUrl,
  getPdfDownloadUrl
}; 