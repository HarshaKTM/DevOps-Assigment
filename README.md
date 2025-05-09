# Healthcare Appointment System

A comprehensive microservices-based healthcare appointment management system deployed on Google Cloud Platform. This system includes backend services, a web application, and a mobile application.

## Table of Contents

- [System Architecture](#system-architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
  - [Backend Services](#backend-services)
  - [Web Application](#web-application)
  - [Mobile Application](#mobile-application)
- [Deployment](#deployment)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Kubernetes Deployment](#kubernetes-deployment)
  - [Environment Management](#environment-management)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## System Architecture

The Healthcare Appointment System uses a microservices architecture deployed on Google Cloud Platform:

- **Backend Services**:
  - **Appointment Service**: Manages appointment scheduling, updates, and cancellations
  - **Doctor Service**: Manages doctor profiles, specialties, and availability
  - **Patient Service**: Manages patient profiles and medical history
  - **Notification Service**: Handles email and SMS notifications
  - **Medical Records Service**: Manages patient medical records

- **Frontend Applications**:
  - **Web Application**: React-based admin portal and patient portal
  - **Mobile Application**: React Native patient mobile app

- **Infrastructure**:
  - **Google Kubernetes Engine (GKE)**: Hosts all microservices
  - **Cloud SQL**: PostgreSQL databases for services
  - **Pub/Sub**: Event messaging between services
  - **Cloud Storage**: Storage for medical records
  - **Cloud Build**: CI/CD pipeline
  - **Artifact Registry**: Container image storage

## Features

- Appointment scheduling, rescheduling, and cancellation
- Doctor and patient management
- Medical records storage and retrieval
- Automated notifications (email, SMS)
- Role-based access control
- Cross-service communication
- Real-time updates
- Mobile and web interfaces

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [React Native setup](https://reactnative.dev/docs/environment-setup)
- [Terraform](https://www.terraform.io/downloads.html) (for infrastructure deployment)

## Local Development

### Backend Services

Each backend service can be run independently for local development. Follow these steps for each service:

1. Navigate to the service directory:
   ```bash
   cd services/[service-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your local development settings.

5. Start the development server:
   ```bash
   npm run dev
   ```

#### Database Setup

For local development, you can use Docker to run PostgreSQL:

```bash
docker run --name healthcare-postgres -e POSTGRES_PASSWORD=your_password -e POSTGRES_USER=healthcare_user -p 5432:5432 -d postgres:13
```

Create the necessary databases:

```bash
docker exec -it healthcare-postgres psql -U healthcare_user -c "CREATE DATABASE appointment_service;"
docker exec -it healthcare-postgres psql -U healthcare_user -c "CREATE DATABASE doctor_service;"
docker exec -it healthcare-postgres psql -U healthcare_user -c "CREATE DATABASE patient_service;"
docker exec -it healthcare-postgres psql -U healthcare_user -c "CREATE DATABASE medical_records;"
```

### Web Application

To run the web application locally:

1. Navigate to the web app directory:
   ```bash
   cd frontend/web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for API endpoints:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000.

### Mobile Application

To run the mobile application locally:

1. Navigate to the mobile app directory:
   ```bash
   cd mobile/patient-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Metro bundler:
   ```bash
   npm start
   ```

4. In a new terminal, launch the app on iOS or Android:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## Deployment

### CI/CD Pipeline

The system uses Cloud Build for continuous integration and deployment:

1. Code changes are committed to GitHub repositories.
2. Cloud Build triggers are configured to run when changes are pushed.
3. The CI/CD pipeline includes:
   - Code linting and testing
   - Security scanning
   - Container image building
   - Deployment to GKE
   - Integration testing
   - Automatic rollbacks if needed

To manually trigger the CI/CD pipeline:

```bash
gcloud builds submit --config=cloudbuild.yaml .
```

### Kubernetes Deployment

The system is deployed to Google Kubernetes Engine using Kubernetes manifests and Kustomize for environment-specific configurations.

Deploy to a specific environment:

```bash
# Apply the development configuration
kubectl apply -k kubernetes/dev

# Apply the staging configuration
kubectl apply -k kubernetes/staging

# Apply the production configuration
kubectl apply -k kubernetes/prod
```

### Environment Management

The system supports multiple environments (development, staging, production) using Kustomize configurations.

Each environment has its own:
- Resource limits
- Replica counts
- Environment variables
- Secrets

## API Documentation

API documentation is available at:
- Development: https://dev-api.healthcare-system.example.com/docs
- Staging: https://staging-api.healthcare-system.example.com/docs
- Production: https://api.healthcare-system.example.com/docs

## Testing

Run tests for backend services:

```bash
cd services/[service-name]
npm test
```

Run tests for the web application:

```bash
cd frontend/web-app
npm test
```

Run tests for the mobile application:

```bash
cd mobile/patient-app
npm test
```

## Troubleshooting

### Common Issues

1. **Connection errors between services**: Check environment variables for service URLs and ensure services are running.

2. **Database connection issues**: Verify database credentials and connectivity.

3. **Authentication errors**: Check JWT secret configuration and token expiration.

4. **Kubernetes deployment issues**: Verify that secrets and configmaps are properly created.

### Logs

View logs for a specific service in Kubernetes:

```bash
kubectl logs -f deployment/[service-name] -n healthcare-system
```

View Cloud Build logs:

```bash
gcloud builds log [BUILD_ID]
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 