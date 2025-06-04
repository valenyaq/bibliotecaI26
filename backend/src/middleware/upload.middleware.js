const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { UploadClient } = require('@uploadcare/upload-client');

// Configurar el cliente de Uploadcare
const uploadcare = new UploadClient({ 
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY
});

// Crear directorio temporal para subidas
const createTempDir = async () => {
  const tempDir = path.join(__dirname, '../../uploads/temp');
  try {
    await fs.access(tempDir);
  } catch {
    await fs.mkdir(tempDir, { recursive: true });
  }
  return tempDir;
};

// Configuración para archivos temporales
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const tempDir = await createTempDir();
      cb(null, tempDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = file.fieldname === 'portada' ? 'portada-' : 'libro-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para archivos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'portada') {
    // Filtro para imágenes (acepta jpg, jpeg, png, webp, gif, svg)
    const allowedImageTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif', 
      'image/svg+xml'
    ];
    
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Por favor sube solo imágenes (JPG, PNG, WEBP, GIF o SVG) para la portada'), false);
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

// Función auxiliar para subir un archivo a Uploadcare
const uploadFileToUploadcare = async (filePath, fileName, mimeType) => {
  try {
    const fileContent = await fs.readFile(filePath);
    const result = await uploadcare.uploadFile(fileContent, {
      contentType: mimeType,
      fileName: fileName,
      store: true
    });
    return result.cdnUrl;
  } catch (error) {
    throw new Error(`Error al subir archivo a Uploadcare: ${error.message}`);
  }
};

// Función auxiliar para limpiar archivo temporal
const cleanupTempFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error al eliminar archivo temporal:', error);
  }
};

// Middleware para subir a Uploadcare
const uploadToCloudService = async (req, res, next) => {
  try {
    if (!req.files) {
      return next();
    }

    // Subir portada si existe
    if (req.files.portada && req.files.portada[0]) {
      const portadaFile = req.files.portada[0];
      console.log('Subiendo portada:', portadaFile.originalname);
      
      try {
        req.body.portada_url = await uploadFileToUploadcare(
          portadaFile.path,
          portadaFile.originalname,
          portadaFile.mimetype
        );
        await cleanupTempFile(portadaFile.path);
        console.log('Portada subida exitosamente:', req.body.portada_url);
      } catch (uploadError) {
        console.error('Error al subir portada a Uploadcare:', uploadError);
        throw new Error('Error al subir la portada: ' + uploadError.message);
      }
    }

    // Subir PDF si existe
    if (req.files.archivo && req.files.archivo[0]) {
      const archivoFile = req.files.archivo[0];
      console.log('Subiendo PDF:', archivoFile.originalname);
      
      try {
        req.body.archivo_url = await uploadFileToUploadcare(
          archivoFile.path,
          archivoFile.originalname,
          archivoFile.mimetype
        );
          await cleanupTempFile(archivoFile.path);
        console.log('PDF subido exitosamente:', req.body.archivo_url);
      } catch (uploadError) {
        console.error('Error al subir PDF a Uploadcare:', uploadError);
        throw new Error('Error al subir el PDF: ' + uploadError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Error en uploadToCloudService:', error);
      // Limpiar archivos temporales en caso de error
    if (req.files) {
      for (const files of Object.values(req.files)) {
        for (const file of files) {
          await cleanupTempFile(file.path);
        }
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al subir archivos',
      error: error.message
    });
  }
};

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
  uploadToCloudService,
  handleMulterError
};