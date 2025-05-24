const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio de uploads si no existe
const createUploadDir = (dir) => {
  const uploadDir = path.join(__dirname, '../../uploads', dir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Asegurar que existan los directorios
createUploadDir('portadas');
createUploadDir('libros');

// Configuración para múltiples archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;
    if (file.fieldname === 'portada') {
      uploadDir = createUploadDir('portadas');
    } else if (file.fieldname === 'archivo') {
      uploadDir = createUploadDir('libros');
    } else {
      uploadDir = createUploadDir('otros');
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = '';
    if (file.fieldname === 'portada') {
      prefix = 'portada-';
    } else if (file.fieldname === 'archivo') {
      prefix = 'libro-';
    }
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para archivos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'portada') {
    // Filtro para imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Por favor sube solo imágenes para la portada'), false);
    }
  } else if (file.fieldname === 'archivo') {
    // Filtro para PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Por favor sube solo archivos PDF para el libro'), false);
    }
  } else {
    cb(null, true);
  }
};

// Middleware para subir archivos
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB max
  }
});

// Configuración para múltiples campos
const uploadArchivos = upload.fields([
  { name: 'portada', maxCount: 1 },
  { name: 'archivo', maxCount: 1 }
]);

// Manejo de errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir archivo: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  uploadArchivos,
  handleMulterError
}; 