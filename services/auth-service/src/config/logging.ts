import winston from 'winston';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const setupLogging = () => {
  const logLevel = process.env.LOG_LEVEL || 'info';

  // Create winston logger
  const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'auth-service' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
          )
        ),
      }),
    ],
  });

  // Add file transports in production
  if (process.env.NODE_ENV === 'production') {
    logger.add(
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    );
    logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
  }

  return logger;
}; 