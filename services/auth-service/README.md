# Authentication Service

A central authentication service for the healthcare appointment system.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Secure password hashing
- API error handling
- Comprehensive logging

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (requires authentication)

## Setup

1. Install dependencies
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8080
   NODE_ENV=development
   LOG_LEVEL=info

   # Database configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=healthcare_user
   DB_PASSWORD=healthcare_password
   DB_NAME=auth_service
   DB_SSL=false

   # JWT configuration
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   ```

3. Build the service
   ```
   npm run build
   ```

4. Run the service
   ```
   npm start
   ```

   For development:
   ```
   npm run dev
   ```

## Database Schema

### Users Table

- `id` (int, PK) - User ID
- `email` (string, unique) - User email
- `password` (string) - Hashed password
- `firstName` (string) - User's first name
- `lastName` (string) - User's last name
- `role` (enum) - User role (patient, doctor, admin)
- `createdAt` (datetime) - Record creation time
- `updatedAt` (datetime) - Record update time 