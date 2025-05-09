# Getting Started with Healthcare Appointment System

This guide will help you set up and run the Healthcare Appointment System for both local development and deployment to Google Cloud Platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
  - [Setting Up Backend Services](#setting-up-backend-services)
  - [Running the Web Application](#running-the-web-application)
  - [Running the Mobile Application](#running-the-mobile-application)
- [Cloud Deployment](#cloud-deployment)
  - [Setting Up GCP Project](#setting-up-gcp-project)
  - [Provisioning Infrastructure with Terraform](#provisioning-infrastructure-with-terraform)
  - [Deploying Services to GKE](#deploying-services-to-gke)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have the following tools installed:

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (for cloud deployment)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (for Kubernetes deployment)
- [Terraform](https://www.terraform.io/downloads.html) (for infrastructure provisioning)
- [Android Studio](https://developer.android.com/studio) (for mobile app development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## Local Development Setup

### Setting Up Backend Services

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/healthcare-appointment-system.git
   cd healthcare-appointment-system
   ```

2. Make the database initialization script executable:
   ```bash
   chmod +x services/scripts/init-multiple-dbs.sh
   ```

3. Start all backend services using Docker Compose:
   ```bash
   cd services
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database
   - Redis cache
   - Patient Service
   - Doctor Service
   - Appointment Service
   - Notification Service
   - Medical Records Service
   - PubSub Emulator
   - MailHog (for email testing)

4. Check if all services are running:
   ```bash
   docker-compose ps
   ```

5. Access service health endpoints:
   - Patient Service: http://localhost:4001/health
   - Doctor Service: http://localhost:4002/health
   - Appointment Service: http://localhost:4003/health
   - Notification Service: http://localhost:4004/health
   - Medical Records Service: http://localhost:4005/health

6. Access the MailHog UI to see sent emails:
   - http://localhost:8025

### Running the Web Application

1. Navigate to the web application directory:
   ```bash
   cd frontend/web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   REACT_APP_API_BASE_URL=http://localhost:4000
   REACT_APP_PATIENT_SERVICE_URL=http://localhost:4001
   REACT_APP_DOCTOR_SERVICE_URL=http://localhost:4002
   REACT_APP_APPOINTMENT_SERVICE_URL=http://localhost:4003
   REACT_APP_MEDICAL_RECORDS_SERVICE_URL=http://localhost:4005
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Access the web application at:
   - http://localhost:3000

### Running the Mobile Application

1. Navigate to the mobile application directory:
   ```bash
   cd mobile/patient-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   API_BASE_URL=http://localhost:4000
   PATIENT_SERVICE_URL=http://localhost:4001
   DOCTOR_SERVICE_URL=http://localhost:4002
   APPOINTMENT_SERVICE_URL=http://localhost:4003
   MEDICAL_RECORDS_SERVICE_URL=http://localhost:4005
   ```

4. Start the Metro bundler:
   ```bash
   npm start
   ```

5. In a new terminal, run the app on an emulator or connected device:
   ```bash
   # For Android
   npm run android
   
   # For iOS (macOS only)
   npm run ios
   ```

## Cloud Deployment

### Setting Up GCP Project

1. Create a new GCP project:
   ```bash
   gcloud projects create healthcare-system-[YOUR_UNIQUE_ID]
   ```

2. Set the project as default:
   ```bash
   gcloud config set project healthcare-system-[YOUR_UNIQUE_ID]
   ```

3. Enable required APIs:
   ```bash
   gcloud services enable container.googleapis.com \
                          cloudbuild.googleapis.com \
                          artifactregistry.googleapis.com \
                          sqladmin.googleapis.com \
                          redis.googleapis.com \
                          pubsub.googleapis.com \
                          storage.googleapis.com \
                          secretmanager.googleapis.com \
                          logging.googleapis.com \
                          monitoring.googleapis.com
   ```

### Provisioning Infrastructure with Terraform

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

2. Create a `terraform.tfvars` file with your project settings:
   ```
   project_id    = "healthcare-system-[YOUR_UNIQUE_ID]"
   region        = "us-central1"
   zone          = "us-central1-a"
   environment   = "dev"
   cluster_name  = "healthcare-gke"
   ```

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Review the plan:
   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

6. Configure kubectl to use the new cluster:
   ```bash
   gcloud container clusters get-credentials healthcare-gke --region us-central1 --project healthcare-system-[YOUR_UNIQUE_ID]
   ```

### Deploying Services to GKE

1. Create Kubernetes namespace:
   ```bash
   kubectl apply -f kubernetes/common/namespace.yaml
   ```

2. Create secrets:
   ```bash
   # Example: Create a secret for JWT token
   kubectl create secret generic jwt-secret -n healthcare-system --from-literal=value=your-secret-jwt-key
   
   # Create database credentials
   kubectl create secret generic appointment-service-db-credentials -n healthcare-system \
     --from-literal=username=appointment_user \
     --from-literal=password=your-db-password \
     --from-literal=host=your-db-host \
     --from-literal=port=5432
   
   # Repeat for other services
   ```

3. Deploy the application to the development environment:
   ```bash
   kubectl apply -k kubernetes/dev
   ```

4. Check deployment status:
   ```bash
   kubectl get pods -n healthcare-system
   ```

5. Access the application through the Istio Gateway:
   ```bash
   kubectl get svc istio-ingressgateway -n istio-system
   ```

## Development Workflow

### Backend Development

1. Make changes to a service
2. Run tests: `npm test`
3. Update the service container in the development environment:
   ```bash
   cd services/[service-name]
   docker-compose up -d --build [service-name]
   ```

### Frontend Development

1. Make changes to the web app
2. Test changes locally: `npm test`
3. Build for production: `npm run build`

### Mobile App Development

1. Make changes to the mobile app
2. Test changes on an emulator or device
3. For production builds:
   ```bash
   # For Android
   cd mobile/patient-app
   npm run build:android
   
   # For iOS
   cd mobile/patient-app
   npm run build:ios
   ```

## Troubleshooting

### Common Issues

1. **Docker services not starting**
   - Check logs: `docker-compose logs [service-name]`
   - Ensure ports are not in use by other applications

2. **Database connection issues**
   - Verify database credentials in environment variables
   - Check if PostgreSQL service is running: `docker-compose ps postgres`

3. **API errors in frontend applications**
   - Verify backend service endpoints in `.env` files
   - Check CORS settings in backend services

4. **Mobile app build issues**
   - For Android: Ensure Android SDK and build tools are installed
   - For iOS: Ensure Xcode and CocoaPods are installed

5. **Kubernetes deployment issues**
   - Check pod status: `kubectl get pods -n healthcare-system`
   - View pod logs: `kubectl logs [pod-name] -n healthcare-system`
   - Verify secrets and config maps: `kubectl get secrets -n healthcare-system`

### Getting Help

For more information or assistance:
- Check the project documentation
- Open an issue on GitHub
- Contact the maintainers 