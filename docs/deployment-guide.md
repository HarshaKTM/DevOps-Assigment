# Healthcare Appointment System - Deployment Guide

This guide provides detailed instructions for building, deploying, and monitoring the Healthcare Appointment System using Docker, Kubernetes, Google Cloud Platform, Terraform, and monitoring tools.

## Table of Contents
- [Docker Setup](#docker-setup)
- [Google Cloud Platform Setup](#google-cloud-platform-setup)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring and Observability](#monitoring-and-observability)

## Docker Setup

### Prerequisites
- Docker installed locally (Docker Desktop for Windows/Mac or Docker Engine for Linux)
- Docker Compose installed
- Access to Google Container Registry (GCR)

### Building Docker Images

Each microservice contains a Dockerfile in its root directory. Here's how to build them:

1. **Building a single service**:
   ```bash
   cd services/appointment-service
   docker build -t healthcare/appointment-service:latest .
   ```

2. **Building all services with docker-compose**:
   ```bash
   cd services
   docker-compose build
   ```

3. **Running services locally**:
   ```bash
   cd services
   docker-compose up -d
   ```

4. **Pushing images to Google Container Registry (GCR)**:
   ```bash
   # Tag the image for GCR
   docker tag healthcare/appointment-service:latest gcr.io/[PROJECT_ID]/appointment-service:latest
   
   # Push to GCR
   docker push gcr.io/[PROJECT_ID]/appointment-service:latest
   ```

### Dockerfile Explanation

Our Dockerfiles follow a multi-stage build pattern to minimize image size:

```dockerfile
# Example appointment-service Dockerfile

# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Google Cloud Platform Setup

### Prerequisites
- Google Cloud account
- Google Cloud SDK (gcloud CLI) installed
- Project created in Google Cloud Console

### Initial Setup

1. **Authenticate with gcloud**:
   ```bash
   gcloud auth login
   ```

2. **Set your project**:
   ```bash
   gcloud config set project [PROJECT_ID]
   ```

3. **Enable required APIs**:
   ```bash
   gcloud services enable container.googleapis.com \
       cloudbuild.googleapis.com \
       cloudresourcemanager.googleapis.com \
       compute.googleapis.com \
       servicenetworking.googleapis.com \
       sqladmin.googleapis.com \
       pubsub.googleapis.com
   ```

4. **Create a service account for Terraform**:
   ```bash
   gcloud iam service-accounts create terraform-sa --display-name "Terraform Service Account"
   
   # Grant necessary permissions
   gcloud projects add-iam-policy-binding [PROJECT_ID] \
       --member="serviceAccount:terraform-sa@[PROJECT_ID].iam.gserviceaccount.com" \
       --role="roles/editor"
   
   # Create and download key file
   gcloud iam service-accounts keys create key.json \
       --iam-account=terraform-sa@[PROJECT_ID].iam.gserviceaccount.com
   ```

## Terraform Infrastructure

### Prerequisites
- Terraform installed (v1.0.0 or newer)
- Service account key from previous step

### Terraform Configuration

Our Terraform configuration is organized into modules and environments:

1. **Initialize Terraform**:
   ```bash
   cd terraform/environments/development
   terraform init
   ```

2. **Review the plan**:
   ```bash
   terraform plan -var="project_id=[PROJECT_ID]"
   ```

3. **Apply the configuration**:
   ```bash
   terraform apply -var="project_id=[PROJECT_ID]"
   ```

### Key Terraform Resources

Our Terraform configuration creates:

1. **GKE Cluster** (Google Kubernetes Engine)
   ```hcl
   module "gke_cluster" {
     source           = "../../modules/gke"
     project_id       = var.project_id
     region           = var.region
     cluster_name     = "${var.environment}-healthcare-cluster"
     node_count       = var.node_count
     machine_type     = var.machine_type
     disk_size_gb     = 100
     kubernetes_version = "1.24"
   }
   ```

2. **Cloud SQL Database**
   ```hcl
   module "database" {
     source           = "../../modules/cloudsql"
     project_id       = var.project_id
     region           = var.region
     db_instance_name = "${var.environment}-healthcare-db"
     database_version = "POSTGRES_13"
     tier             = "db-g1-small"
   }
   ```

3. **Pub/Sub Topics** (for event-driven communication)
   ```hcl
   module "pubsub" {
     source           = "../../modules/pubsub"
     project_id       = var.project_id
     topics           = ["appointments", "notifications", "medical-records"]
   }
   ```

4. **Cloud Build Triggers**
   ```hcl
   module "cloudbuild" {
     source           = "../../modules/cloudbuild"
     project_id       = var.project_id
     repository_name  = "github_[USERNAME]_healthcare-appointment-system"
     branch_regex     = var.environment == "production" ? "^main$" : "^develop$"
   }
   ```

## Kubernetes Deployment

### Prerequisites
- kubectl installed
- Access to GKE cluster

### Deploying to Kubernetes

We use Kustomize for environment-specific Kubernetes configurations:

1. **Get credentials for your GKE cluster**:
   ```bash
   gcloud container clusters get-credentials [CLUSTER_NAME] --region [REGION] --project [PROJECT_ID]
   ```

2. **Deploy to development environment**:
   ```bash
   kubectl apply -k kubernetes/dev
   ```

3. **Deploy to staging or production**:
   ```bash
   kubectl apply -k kubernetes/staging
   # or
   kubectl apply -k kubernetes/prod
   ```

4. **Verify deployments**:
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

### Kustomize Structure

Our Kubernetes configuration uses Kustomize overlays:

- **Base**: Contains common configurations
- **Dev/Staging/Prod**: Contains environment-specific configurations

```
kubernetes/
├── base/
│   ├── appointment-service/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── kustomization.yaml
│   ├── ...other services...
│   └── kustomization.yaml
├── dev/
│   ├── kustomization.yaml
│   └── patches/
├── staging/
│   ├── kustomization.yaml
│   └── patches/
└── prod/
    ├── kustomization.yaml
    └── patches/
```

### Example Deployment Manifest

```yaml
# kubernetes/base/appointment-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appointment-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: appointment-service
  template:
    metadata:
      labels:
        app: appointment-service
    spec:
      containers:
      - name: appointment-service
        image: gcr.io/PROJECT_ID/appointment-service:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        env:
        - name: NODE_ENV
          value: production
        - name: PORT
          value: "3000"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: host
        # Additional environment variables...
```

## Monitoring and Observability

We use several tools for monitoring our application:

### Google Cloud Operations Suite (formerly Stackdriver)

1. **Enable monitoring** (automatically enabled for GKE clusters)

2. **Create custom dashboards**:
   - Navigate to Cloud Monitoring > Dashboards
   - Create dashboard with key metrics for services

3. **Set up alerts**:
   ```bash
   gcloud alpha monitoring policies create \
     --policy-from-file=monitoring/alert-policies/high-cpu-usage.yaml
   ```

### Prometheus and Grafana

1. **Install using Helm**:
   ```bash
   # Add Prometheus repo
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   
   # Install Prometheus stack
   helm install monitoring prometheus-community/kube-prometheus-stack \
     --namespace monitoring \
     --create-namespace
   ```

2. **Access Grafana dashboard**:
   ```bash
   kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
   ```
   
   Then visit: http://localhost:3000 (default credentials: admin/prom-operator)

3. **Import custom dashboards** from monitoring/grafana-dashboards directory

### Distributed Tracing with Cloud Trace

1. **Configure services** to send traces:
   - Use @google-cloud/trace-agent in Node.js services
   - Example initialization:
     ```javascript
     require('@google-cloud/trace-agent').start({
       projectId: 'your-project-id',
       keyFilename: '/path/to/key.json',
       samplingRate: 0.5  // Sample 50% of requests
     });
     ```

2. **View traces** in Google Cloud Console > Trace

## CI/CD Pipeline

Our CI/CD pipeline is managed by Google Cloud Build, with configurations in cloudbuild.yaml:

```yaml
steps:
# Run tests
- name: 'gcr.io/cloud-builders/npm'
  args: ['test']
  dir: 'services/appointment-service'

# Security scan
- name: 'gcr.io/$PROJECT_ID/security-scanner'
  args: ['scan', '.']

# Build container
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/appointment-service:$COMMIT_SHA', '.']
  dir: 'services/appointment-service'

# Push to Container Registry
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/$PROJECT_ID/appointment-service:$COMMIT_SHA']

# Deploy to GKE
- name: 'gcr.io/cloud-builders/kubectl'
  args:
  - 'set'
  - 'image'
  - 'deployment/appointment-service'
  - 'appointment-service=gcr.io/$PROJECT_ID/appointment-service:$COMMIT_SHA'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-central1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=healthcare-cluster'

# Run integration tests
- name: 'gcr.io/$PROJECT_ID/integration-tester'
  args: ['run', 'api-tests']
  
images:
- 'gcr.io/$PROJECT_ID/appointment-service:$COMMIT_SHA'
```

## Additional Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/) 