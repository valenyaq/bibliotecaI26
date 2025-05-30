const express = require('express');
const router = express.Router();
const valoracionController = require('../controllers/valoracion.controller');

// Ruta para obtener todas las valoraciones
router.get('/', valoracionController.getAllValoraciones);

module.exports = router;
