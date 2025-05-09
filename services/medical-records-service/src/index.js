const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');
const authMiddleware = require('./middleware/auth.middleware');
const logger = require('./utils/logger');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Create storage directory for local file storage if needed
if (process.env.STORAGE_LOCAL === 'true') {
  const storageDir = process.env.STORAGE_PATH || path.join(__dirname, '../storage');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
    logger.info(`Created storage directory: ${storageDir}`);
  }
}

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'healthcare_user',
  password: process.env.DB_PASSWORD || 'healthcare_password',
  database: process.env.DB_NAME || 'medical_records',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection error:', err);
    process.exit(1);
  } else {
    logger.info('Connected to PostgreSQL database');
  }
});

// Make db available to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/medical-records', medicalRecordRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'medical-records-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Medical Records service running on port ${PORT}`);
});

module.exports = app;