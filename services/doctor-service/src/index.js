const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const doctorRoutes = require('./routes/doctor.routes');
const authMiddleware = require('./middleware/auth.middleware');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-doctors', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/doctors', doctorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'doctor-service' });
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
  logger.info(`Doctor service running on port ${PORT}`);
});

module.exports = app; 