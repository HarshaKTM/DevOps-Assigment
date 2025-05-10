import { sequelize } from './config/database';
import User from './models/user.model';
import { setupLogging } from './config/logging';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const logger = setupLogging();

// Test users to seed
const users = [
  {
    email: 'admin@healthcare.com',
    password: 'Password123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'doctor@healthcare.com',
    password: 'Password123!',
    firstName: 'Doctor',
    lastName: 'Smith',
    role: 'doctor'
  },
  {
    email: 'patient@healthcare.com',
    password: 'Password123!',
    firstName: 'Patient',
    lastName: 'Doe',
    role: 'patient'
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established');

    // Sync models
    await sequelize.sync({ force: true });
    logger.info('Database synchronized');

    // Create users
    for (const userData of users) {
      await User.create(userData);
    }

    logger.info('Database seeded with test users');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 