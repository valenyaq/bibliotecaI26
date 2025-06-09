const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { UploadClient } = require('@uploadcare/upload-client');
const sharp = require('sharp');

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
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
    console.error('Error detallado al subir archivo a Uploadcare:', error.response ? error.response.data : error.message);
    throw new Error(`Error al subir archivo a Uploadcare: ${error.message}`);
  }
};

// Función auxiliar para limpiar archivo temporal
const cleanupTempFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
       console.error('Error al eliminar archivo temporal:', error);
    }
  }
};

// Middleware para subir a Uploadcare y optimizar portadas
const uploadToCloudService = async (req, res, next) => {
  const filesToCleanup = [];
  try {
    if (!req.files) {
      return next();
    }

    // Procesar y subir portada si existe
    if (req.files.portada && req.files.portada[0]) {
      const portadaFile = req.files.portada[0];
      filesToCleanup.push(portadaFile.path);

      console.log('Procesando y subiendo portada:', portadaFile.originalname);
        try {
        // Si el archivo ya es WebP, lo usamos directamente
        if (portadaFile.mimetype === 'image/webp') {
          req.body.portada_url = await uploadFileToUploadcare(
            portadaFile.path,
            portadaFile.originalname,
            'image/webp'
          );
        } else {
          // Si no es WebP, lo convertimos
          const webpFileName = `${path.parse(portadaFile.filename).name}.webp`;
          const webpFilePath = path.join(path.dirname(portadaFile.path), webpFileName);
          filesToCleanup.push(webpFilePath);

          await sharp(portadaFile.path)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(webpFilePath);

          req.body.portada_url = await uploadFileToUploadcare(
            webpFilePath,
            webpFileName,
            'image/webp'
          );
        }
        console.log('Portada optimizada (WebP) y subida exitosamente:', req.body.portada_url);

      } catch (processError) {
        console.error('Error al procesar o subir la portada:', processError);
        throw new Error('Error al procesar o subir la portada: ' + processError.message);
      }
    }

    // Procesar y subir PDF si existe (sin optimización)
    if (req.files.archivo && req.files.archivo[0]) {
      const archivoFile = req.files.archivo[0];
      filesToCleanup.push(archivoFile.path);

      console.log('Subiendo PDF:', archivoFile.originalname);
      
      try {
        req.body.archivo_url = await uploadFileToUploadcare(
          archivoFile.path,
          archivoFile.originalname,
          archivoFile.mimetype
        );
        console.log('PDF subido exitosamente:', req.body.archivo_url);
      } catch (uploadError) {
        console.error('Error al subir PDF a Uploadcare:', uploadError);
        throw new Error('Error al subir el PDF: ' + uploadError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Error en uploadToCloudService:', error);
    
    for (const filePath of filesToCleanup) {
        await cleanupTempFile(filePath);
    }

    return res.status(500).json({
      success: false,
      message: 'Error en el procesamiento/subida de archivos',
      error: error.message
    });
  } finally {
      for (const filePath of filesToCleanup) {
          await cleanupTempFile(filePath);
      }
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