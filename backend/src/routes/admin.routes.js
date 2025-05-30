const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin, limitLoginAttempts } = require('../middleware/auth.middleware');
const { validateLogin, validatePasswordChange } = require('../middleware/joi.validation.middleware');

// Ruta de login (pública)
router.post('/login', limitLoginAttempts, validateLogin, adminController.login);

// Rutas protegidas
router.post('/change-password', isAdmin, validatePasswordChange, adminController.changePassword);

module.exports = router;