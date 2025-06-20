const express = require('express');
const router = express.Router();
const generoController = require('../controllers/genero.controller');
const { isAdmin } = require('../middleware/auth.middleware');
const { validateGenero } = require('../middleware/joi.validation.middleware');

// Rutas públicas
router.get('/', generoController.getAllGeneros);
router.get('/:id', generoController.getGeneroById);

// Rutas privadas (solo administrador)
router.post('/', isAdmin, validateGenero, generoController.createGenero);
router.put('/:id', isAdmin, validateGenero, generoController.updateGenero);
router.delete('/:id', isAdmin, generoController.deleteGenero);

module.exports = router; 