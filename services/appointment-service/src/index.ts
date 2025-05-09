import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import appointmentRoutes from './routes/appointment.routes';
import { errorHandler } from './middleware/error.middleware';
import { setupLogging } from './config/logging';
import { setupPubSub } from './utils/pubsub';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Setup logging
const logger = setupLogging();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  res.status(200).json({
    appointments_scheduled_total: 0,
    appointments_canceled_total: 0,
    appointments_rescheduled_total: 0,
    appointment_booking_duration_ms: 0,
  });
});

// Routes
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
async function startServer() {
  try {
    // Setup PubSub
    await setupPubSub();
    logger.info('PubSub initialized successfully');
    
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Sync database models
    await sequelize.sync();
    logger.info('Database models synchronized');
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Appointment service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer(); 