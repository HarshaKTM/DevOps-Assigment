# Healthcare Portal

A modern, secure healthcare platform for connecting patients with healthcare providers, managing appointments, and accessing medical records.

![Healthcare Portal](https://via.placeholder.com/800x400?text=Healthcare+Portal)

## Overview

Healthcare Portal is a comprehensive platform designed to streamline healthcare services by providing a unified interface for patients, doctors, and administrators. The platform enables appointment scheduling, medical record management, secure communications, and patient monitoring.

## Features

- **User Authentication**: Secure login and registration for patients, doctors, and admins
- **Appointment Management**: Schedule, reschedule, and cancel appointments
- **Medical Records**: Access and manage patient health records securely
- **Doctor Directory**: Find specialists and healthcare providers
- **Patient Dashboard**: Personalized view of healthcare information
- **Responsive Design**: Optimized for desktop and mobile devices

## Architecture

The application follows a microservices architecture deployed on Google Cloud Platform using Kubernetes and managed with Terraform:

- **Frontend**: React.js web application
- **Backend Services**:
  - Authentication Service (Node.js/Express)
  - Patient Service (Node.js/Express)
  - Appointment Service (Node.js/Express)
  - Doctor Service (Node.js/Express)
  - Medical Records Service (Node.js/Express)
- **Database**: PostgreSQL for structured data
- **Caching Layer**: Redis for performance optimization
- **Message Queue**: Google Pub/Sub for service communication

## Tech Stack

### Frontend
- React.js
- Redux for state management
- React Router for navigation
- Custom CSS with responsive design

### Backend
- Node.js with TypeScript
- Express.js for API routing and RESTful endpoints
- JWT for authentication and authorization
- Sequelize ORM for database interactions
- PostgreSQL for persistent data storage
- Winston for structured logging and error tracking
- Jest and Supertest for unit and integration testing
- Swagger for API documentation

### DevOps & Infrastructure
- **Google Cloud Platform**: Cloud infrastructure provider
- **Kubernetes**: Container orchestration for microservices deployment
- **Terraform**: Infrastructure as Code (IaC) for managing GCP resources
- **Docker**: Containerization of all services
- **Git**: Version control and CI/CD workflow
- **GitHub Actions**: CI/CD pipeline automation

### Monitoring & Observability
- **Google Cloud Operations (formerly Stackdriver)**: Monitoring and logging
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **Jaeger**: Distributed tracing

## Infrastructure Diagram

```
                                 +----------------+
                                 |   Cloud Load   |
                                 |   Balancer     |
                                 +--------+-------+
                                          |
                                 +--------v-------+
                                 |   Kubernetes   |
                                 |   Cluster      |
                                 +----------------+
                                 |                |
           +------------+        |  +---------+  |        +-----------+
           |            |        |  |Frontend |  |        |           |
           |  Cloud SQL +<-------+--+         |  +-------->  Cloud    |
           | (PostgreSQL)|       |  +---------+  |        |  Storage  |
           |            |        |                |        |           |
           +------------+        |  +---------+  |        +-----------+
                                 |  |Backend  |  |
                                 |  |Services |  |        +-----------+
           +------------+        |  +---------+  |        |           |
           |            |        |                |        |  Cloud    |
           |   Redis    +<-------+--+---------+  +-------->  Pub/Sub  |
           |   Cache    |        |  |API Gateway|  |        |           |
           |            |        |  +---------+  |        +-----------+
           +------------+        |                |
                                 +----------------+
```

## Deployment Architecture

- **Development**: Local Docker environment with docker-compose
- **Testing**: GCP Kubernetes cluster with dedicated namespace
- **Staging**: GCP Kubernetes cluster with staging environment
- **Production**: GCP Kubernetes cluster with high-availability configuration

### CI/CD Pipeline

1. Code push to Git repository
2. GitHub Actions trigger CI pipeline
3. Run unit and integration tests
4. Build Docker images
5. Push images to Google Container Registry
6. Update Kubernetes deployments using Terraform
7. Run smoke tests against new deployment
8. Promote to next environment if tests pass

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose
- Google Cloud SDK
- Terraform CLI
- kubectl

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/your-org/healthcare-portal.git
   cd healthcare-portal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development environment:
   ```
   docker-compose up -d
   ```

4. Access the application:
   ```
   http://localhost:3000
   ```

### Cloud Deployment

1. Set up Google Cloud credentials:
   ```
   gcloud auth login
   gcloud config set project your-project-id
   ```

2. Initialize Terraform:
   ```
   cd terraform
   terraform init
   ```

3. Apply Terraform configuration:
   ```
   terraform plan
   terraform apply
   ```

4. Configure kubectl:
   ```
   gcloud container clusters get-credentials healthcare-cluster --zone us-central1-a
   ```

5. Deploy application:
   ```
   kubectl apply -f kubernetes/
   ```

## Monitoring and Observability

- Access Google Cloud Operations dashboard for logs and metrics
- Monitor application performance with Prometheus and Grafana
- Track service interactions with Jaeger tracing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: support@healthcare-portal.com
- Website: https://healthcare-portal.com 