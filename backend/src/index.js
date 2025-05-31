const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rutas
const librosRoutes = require('./routes/libros.routes');
const adminRoutes = require('./routes/admin.routes');
const generosRoutes = require('./routes/generos.routes');
const valoracionesRoutes = require('./routes/valoraciones.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://biblioteca-pa.netlify.app', 'https://biblioteca-virtual-app.netlify.app', process.env.FRONTEND_URL].filter(Boolean)
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Directorios para archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api/libros', librosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/generos', generosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

// Ruta para servir el worker de PDF.js
app.get('/pdf.worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pdfjs/pdf.worker.js'));
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Biblioteca funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 