const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');
const valoracionController = require('../controllers/valoracion.controller');
const { isAdmin } = require('../middleware/auth.middleware');
const { uploadArchivos, handleMulterError, uploadToCloudService } = require('../middleware/upload.middleware');
const { validateLibro, validateValoracion } = require('../middleware/joi.validation.middleware');
const path = require('path');

// Rutas públicas específicas (poner antes que rutas con :id)
router.get('/paginados', libroController.getLibrosPaginados);
router.get('/genero/:id/paginados', libroController.getLibrosByGeneroPaginados);
router.get('/search', libroController.searchLibros);
router.get('/genero/:id', libroController.getLibrosByGenero);

// Rutas para descargar/ver PDF
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
    } else {
      console.log('Archivo enviado correctamente para descarga');
    }
  });
});

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
    } else {
      console.log('PDF servido correctamente');
    }
  });
});

// Rutas públicas generales
router.get('/', libroController.getAllLibros);

// Rutas públicas con ID
router.get('/:id', libroController.getLibroById);
router.get('/:id/valoraciones', valoracionController.getValoracionesByLibro);
router.get('/:id/valoraciones/promedio', valoracionController.getPromedioByLibro);
router.post('/:id/valoraciones', validateValoracion, valoracionController.createValoracion);

// Rutas privadas (solo administrador)
router.post('/', isAdmin, uploadArchivos, handleMulterError, uploadToCloudService, validateLibro, libroController.createLibro);
router.put('/:id', isAdmin, uploadArchivos, handleMulterError, uploadToCloudService, validateLibro, libroController.updateLibro);
router.delete('/:id', isAdmin, libroController.deleteLibro);

module.exports = router; 