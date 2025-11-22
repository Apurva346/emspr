// utils/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
const tempUploadDir = path.join(__dirname, '../temp-uploads');

// Create directories if they don't exist (handled in server.js now, but good to keep modular)
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir);


// Image Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// CSV Upload Storage (uses 'temp-uploads' directory as defined in server.js)
const csvUpload = multer({ dest: tempUploadDir });

module.exports = {
    upload,
    csvUpload,
    uploadDir
};