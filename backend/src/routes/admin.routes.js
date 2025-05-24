const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/auth.middleware');

// Ruta de login (pública)
router.post('/login', adminController.login);

// Rutas protegidas
router.get('/profile', isAdmin, adminController.getProfile);
router.post('/change-password', isAdmin, adminController.changePassword);

// Ruta para crear admin (solo para desarrollo/configuración inicial)
// En un entorno de producción, esto debería estar más protegido
router.post('/create', adminController.createAdmin);

module.exports = router; 