const { UploadClient } = require('@uploadcare/upload-client');

const uploadcare = new UploadClient({ 
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    secretKey: process.env.UPLOADCARE_SECRET_KEY 
});

module.exports = uploadcare;
