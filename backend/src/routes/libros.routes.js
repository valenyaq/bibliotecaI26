const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');
const valoracionController = require('../controllers/valoracion.controller');
const { isAdmin } = require('../middleware/auth.middleware');
const { uploadArchivos, handleMulterError } = require('../middleware/upload.middleware');
const path = require('path');

// Rutas públicas
router.get('/', libroController.getAllLibros);
router.get('/search', libroController.searchLibros);
router.get('/genero/:id', libroController.getLibrosByGenero);

// Ruta para descargar un PDF directamente (para descarga)
router.get('/descargar/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/libros', filename);
  console.log('Intentando descargar archivo desde:', filePath);
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error al descargar el archivo:', err);
      return res.status(404).json({ 
        success: false, 
        message: 'Archivo no encontrado' 
      });
    }
  });
});

// Ruta para servir un PDF directamente (para visualización)
router.get('/ver/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/libros', filename);
  console.log('Intentando servir PDF desde:', filePath);
  
  // Configurar cabeceras para visualización en el navegador
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
  
  // Enviar el archivo
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al servir el PDF:', err);
      return res.status(404).json({ 
        success: false, 
        message: 'Archivo no encontrado' 
      });
    }
  });
});

// Obtener un libro por su ID
router.get('/:id', libroController.getLibroById);

// Rutas para valoraciones (públicas)
router.get('/:id/valoraciones', valoracionController.getValoracionesByLibro);
router.get('/:id/valoraciones/promedio', valoracionController.getPromedioByLibro);
router.post('/:id/valoraciones', valoracionController.createValoracion);

// Rutas privadas (solo administrador)
router.post('/', isAdmin, uploadArchivos, handleMulterError, libroController.createLibro);
router.put('/:id', isAdmin, uploadArchivos, handleMulterError, libroController.updateLibro);
router.delete('/:id', isAdmin, libroController.deleteLibro);

module.exports = router; 