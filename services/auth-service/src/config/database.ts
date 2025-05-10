import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { setupLogging } from './logging';

// Load environment variables
dotenv.config();

const logger = setupLogging();

// Database configuration from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_USER = process.env.DB_USER || 'healthcare_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'healthcare_password';
const DB_NAME = process.env.DB_NAME || 'auth_service';
const DB_SSL = process.env.DB_SSL === 'true';

// Set up Sequelize with PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: (msg) => logger.debug(msg),
  dialectOptions: DB_SSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // For self-signed certificates
        },
      }
    : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export { sequelize }; 