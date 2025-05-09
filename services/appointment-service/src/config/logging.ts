import winston from 'winston';

export const setupLogging = () => {
  // Define log format
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );

  // Create logger instance
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'appointment-service' },
    transports: [
      // Console transport for all environments
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });

  // Add production-specific transports if needed
  if (process.env.NODE_ENV === 'production') {
    // Example: Send logs to Google Cloud Logging
    // This would require additional setup with Google Cloud client libraries
  }

  return logger;
}; 