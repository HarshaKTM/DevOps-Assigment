# Healthcare Appointment System

A comprehensive healthcare application with microservices architecture, deployed on Google Cloud Platform.

## System Overview

The Healthcare Appointment System is a full-stack application that allows patients to schedule appointments with doctors, manage their medical records, and receive notifications. It consists of:

- **Backend microservices**: Appointment, Doctor, Patient, Notification, and Medical Records services
- **Frontend web application**: React/TypeScript-based web portal
- **Mobile application**: React Native app for patients
- **Infrastructure**: Deployed on Google Cloud Platform using Kubernetes

## Key Features

- Appointment scheduling and management
- Doctor profile browsing and availability checking
- Medical record storage and retrieval
- Secure authentication and authorization
- Real-time notifications
- Responsive web and mobile interfaces

## Architecture

The system follows a microservices architecture:

- **Service-Based**: Each functional area is implemented as a separate microservice
- **Event-Driven**: Services communicate via events using Google Cloud Pub/Sub
- **API Gateway**: Centralized API access point for frontend applications
- **Container-Based**: Packaged as Docker containers and deployed on Kubernetes

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Pub/Sub for event-driven architecture

### Frontend Web
- React
- TypeScript
- Redux Toolkit
- Material-UI
- Formik & Yup

### Frontend Mobile
- React Native
- TypeScript
- Redux Toolkit
- React Navigation
- React Native Paper

### DevOps & Infrastructure
- Google Cloud Platform
- Kubernetes (GKE)
- Terraform
- Cloud Build
- Docker

## Getting Started

For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md).

For detailed deployment instructions, see [docs/deployment-guide.md](./docs/deployment-guide.md).

## Project Structure

For a detailed overview of the project's directory organization, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## API Documentation

API documentation is generated using Swagger/OpenAPI. When running the services locally, API documentation is available at:

- Appointment Service: http://localhost:3001/api-docs
- Doctor Service: http://localhost:3002/api-docs
- Patient Service: http://localhost:3003/api-docs
- Medical Records Service: http://localhost:3004/api-docs
- Notification Service: http://localhost:3005/api-docs

## Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 