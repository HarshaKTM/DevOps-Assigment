# Healthcare Appointment System - Project Structure

This document outlines the project structure of the Healthcare Appointment System, a comprehensive healthcare application with microservices architecture, web frontend, and mobile application.

## Directory Structure

```
healthcare-appointment-system/
├── cloudbuild.yaml                 # Cloud Build configuration for CI/CD
├── GETTING_STARTED.md              # Getting started guide
├── README.md                       # Project overview
├── PROJECT_STRUCTURE.md            # This file
│
├── frontend/                       # Frontend applications
│   └── web-app/                    # React web application
│       ├── public/                 # Static assets
│       └── src/                    # Source code
│           ├── assets/             # Images, fonts, etc.
│           ├── components/         # Reusable UI components
│           ├── layouts/            # Page layouts
│           ├── pages/              # Page components
│           ├── services/           # API services
│           ├── store/              # Redux store
│           │   └── slices/         # Redux slices
│           ├── types/              # TypeScript type definitions
│           ├── utils/              # Utility functions
│           ├── App.tsx             # Main App component
│           └── index.tsx           # Entry point
│
├── mobile/                         # Mobile applications
│   └── patient-app/                # React Native patient app
│       ├── android/                # Android-specific code
│       ├── ios/                    # iOS-specific code
│       └── src/                    # Source code
│           ├── assets/             # Images, fonts, etc.
│           ├── components/         # Reusable UI components
│           ├── navigation/         # Navigation configuration
│           ├── screens/            # Screen components
│           ├── services/           # API services
│           ├── store/              # Redux store
│           │   └── slices/         # Redux slices
│           ├── types/              # TypeScript type definitions
│           └── utils/              # Utility functions
│
├── kubernetes/                     # Kubernetes deployment manifests
│   ├── base/                       # Base Kustomize configuration
│   ├── dev/                        # Development environment configuration
│   ├── staging/                    # Staging environment configuration
│   ├── prod/                       # Production environment configuration
│   ├── appointment-service/        # Appointment service K8s manifests
│   ├── doctor-service/             # Doctor service K8s manifests
│   ├── patient-service/            # Patient service K8s manifests
│   ├── notification-service/       # Notification service K8s manifests
│   └── medical-records-service/    # Medical records service K8s manifests
│
├── terraform/                      # Infrastructure as Code with Terraform
│   ├── modules/                    # Reusable Terraform modules
│   └── environments/               # Environment-specific configurations
│
└── services/                       # Backend microservices
    ├── scripts/                    # Utility scripts for services
    ├── appointment-service/        # Appointment management service
    │   ├── src/                    # Source code
    │   │   ├── config/             # Configuration files
    │   │   ├── controllers/        # Request handlers
    │   │   ├── middleware/         # Express middleware
    │   │   ├── models/             # Data models
    │   │   ├── routes/             # API routes
    │   │   ├── utils/              # Utility functions
    │   │   └── index.ts            # Entry point
    │   ├── Dockerfile              # Docker configuration
    │   ├── Dockerfile.dev          # Development Docker configuration
    │   └── package.json            # Dependencies and scripts
    │
    ├── doctor-service/             # Doctor management service
    │   └── [Similar structure to appointment-service]
    │
    ├── patient-service/            # Patient management service
    │   └── [Similar structure to appointment-service]
    │
    ├── notification-service/       # Email/SMS notification service
    │   └── [Similar structure to appointment-service]
    │
    ├── medical-records-service/    # Medical records management service
    │   └── [Similar structure to appointment-service]
    │
    └── docker-compose.yaml         # Local development configuration
```

## Key Components

### Backend Services

1. **Appointment Service**: Manages appointment scheduling, updates, and cancellations
2. **Doctor Service**: Manages doctor profiles, specialties, and availability
3. **Patient Service**: Manages patient profiles and medical history
4. **Notification Service**: Handles email and SMS notifications
5. **Medical Records Service**: Manages patient medical records

### Frontend Applications

1. **Web Application**: React-based web portal for patients, doctors, and administrators
2. **Mobile Application**: React Native mobile app for patients

### DevOps Components

1. **Kubernetes**: Container orchestration for microservices deployment
2. **Terraform**: Infrastructure as Code for provisioning cloud resources
3. **Cloud Build**: CI/CD pipeline for automated testing and deployment

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