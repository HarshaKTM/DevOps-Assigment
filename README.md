# Healthcare Appointment System

A microservices-based healthcare appointment system with web and mobile applications, deployed on Google Cloud Platform with CI/CD pipelines.

## Project Overview

This project implements a modern healthcare appointment system with the following components:

- **Backend Microservices**:
  - Doctor Service - Express.js + MongoDB
  - Medical Records Service - Express.js + PostgreSQL
  - Appointment Service
  - User Authentication Service

- **Frontend**:
  - Web Dashboard (React + TypeScript + Material UI)
  - Mobile Application (React Native)

- **DevOps**:
  - CI/CD with Google Cloud Build
  - Kubernetes deployment with Kustomize
  - Infrastructure as Code

## System Architecture

The system follows a microservices architecture for scalability and maintainability:

1. **API Gateway**: Routes requests to appropriate microservices
2. **Microservices**: Specialized services for specific domain functionality
3. **Databases**: Combination of relational and document databases
4. **Frontend**: Responsive web app and mobile app
5. **DevOps**: Containerization and orchestration with Docker and Kubernetes

## Key Features

- Patient appointment booking and management
- Doctor schedule management
- Medical records management
- Real-time notifications
- Role-based access control
- Comprehensive reporting and analytics
- Secure medical data storage

## Technology Stack

- **Backend**:
  - Node.js / Express.js
  - MongoDB
  - PostgreSQL
  - Redis for caching
  
- **Frontend**:
  - React with TypeScript
  - Redux for state management
  - Material UI component library
  - React Native for mobile app
  
- **DevOps & Infrastructure**:
  - Docker
  - Kubernetes
  - Google Cloud Platform
  - Terraform
  - Cloud Build CI/CD

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose
- Google Cloud SDK

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/healthcare-appointment-system.git
   cd healthcare-appointment-system
   ```

2. Install dependencies for all services:
   ```
   # For backend services
   cd backend/doctor-service
   npm install
   
   # For web frontend
   cd frontend/web-app
   npm install
   
   # For mobile app
   cd mobile/patient-app
   npm install
   ```

3. Start the development servers:
   ```
   # Start all services using Docker Compose
   docker-compose up
   
   # Or start individual services
   cd backend/doctor-service
   npm run dev
   
   cd frontend/web-app
   npm start
   ```

## Testing

Run tests for all components:

```
# Backend services
cd backend/doctor-service
npm test

# Web frontend
cd frontend/web-app
npm test

# Mobile app
cd mobile/patient-app
npm test
```

## Deployment

The application is deployed on Google Cloud Platform using Kubernetes:

1. Build and push Docker images:
   ```
   gcloud builds submit --config=cloudbuild.yaml
   ```

2. Deploy to GKE:
   ```
   kubectl apply -k kubernetes/overlays/production
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 