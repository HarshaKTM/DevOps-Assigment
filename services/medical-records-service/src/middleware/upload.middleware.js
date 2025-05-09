const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const logger = require('../utils/logger');

// Determine storage based on environment
const getStorage = () => {
  if (process.env.STORAGE_LOCAL === 'true') {
    // Local file storage
    const storageDir = process.env.STORAGE_PATH || path.join(__dirname, '../../storage');
    
    // Ensure directory exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
      logger.info(`Created storage directory: ${storageDir}`);
    }
    
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, storageDir);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueId}${extension}`);
      }
    });
  } else {
    // In-memory storage for cloud uploads
    return multer.memoryStorage();
  }
};

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Accept common file types
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: getStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Error handling for multer
module.exports = upload;

// Custom error handler for multer errors
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}; 