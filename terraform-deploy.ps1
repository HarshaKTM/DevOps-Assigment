# Automated Terraform Deployment Script for Healthcare System
Write-Host "🚀 Starting Terraform Deployment for Healthcare System" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$ZONE = "asia-south1-a"
$ENVIRONMENT = "dev"
$GITHUB_OWNER = "harsha098"
$GITHUB_REPO = "healthcare-appointment-system"
$API_KEY = "AIzaSyDQbDhz5tkFBer7x0t2Uw_bVZqooRtRANc"
$DOCKER_USERNAME = "harsha098"
$SERVICES = @("appointment-service", "patient-service", "doctor-service", "notification-service", "medical-records-service")

# 1. Login to Google Cloud
Write-Host "1️⃣ Setting up Google Cloud authentication..." -ForegroundColor Green

# Check if gcloud is installed
if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Google Cloud SDK (gcloud) is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "   Setting project to $PROJECT_ID..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Create terraform.tfvars file
Write-Host "2️⃣ Creating terraform.tfvars file..." -ForegroundColor Green
@"
project_id       = "$PROJECT_ID"
region           = "$REGION"
zone             = "$ZONE"
environment      = "$ENVIRONMENT"
github_owner     = "$GITHUB_OWNER"
github_repo      = "$GITHUB_REPO"
"@ | Out-File -FilePath "terraform.tfvars" -Encoding ASCII

# Create a simplified setup.tf file
Write-Host "3️⃣ Creating setup.tf file to enable required APIs..." -ForegroundColor Green
@"
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required Google APIs
resource "google_project_service" "services" {
  for_each = toset([
    "container.googleapis.com",      # GKE
    "secretmanager.googleapis.com",  # Secret Manager
    "servicenetworking.googleapis.com", # Service Networking
    "cloudbuild.googleapis.com",     # Cloud Build
    "pubsub.googleapis.com",         # Pub/Sub
    "cloudkms.googleapis.com",       # Cloud KMS
    "sqladmin.googleapis.com",       # Cloud SQL
    "redis.googleapis.com",          # Redis
    "artifactregistry.googleapis.com" # Artifact Registry
  ])

  project = var.project_id
  service = each.key
  disable_dependent_services = false
  disable_on_destroy         = false
}
"@ | Out-File -FilePath "setup.tf" -Encoding ASCII

# Initialize Terraform
Write-Host "4️⃣ Initializing Terraform..." -ForegroundColor Green
terraform init

# Apply APIs first
Write-Host "5️⃣ Enabling required APIs..." -ForegroundColor Green
# Use terraform plan to avoid applying changes that already exist
terraform plan

# Apply infrastructure in phases
Write-Host "6️⃣ Deploying network infrastructure..." -ForegroundColor Green
terraform apply -target="google_compute_network.vpc" -auto-approve
terraform apply -target="google_compute_subnetwork.subnet" -auto-approve
terraform apply -target="google_compute_router.router" -auto-approve
terraform apply -target="google_compute_router_nat.nat" -auto-approve
terraform apply -target="google_compute_firewall.allow_internal" -auto-approve

Write-Host "7️⃣ Deploying Kubernetes cluster..." -ForegroundColor Green
# Note: Update these if container cluster resources exist in your state
terraform plan -target="google_container_cluster.primary"

Write-Host "8️⃣ Deploying KMS keys and storage..." -ForegroundColor Green
terraform apply -target="google_kms_key_ring.keyring" -auto-approve
terraform apply -target="google_kms_crypto_key.storage_encryption_key" -auto-approve
terraform apply -target="google_kms_crypto_key.db_encryption_key" -auto-approve

Write-Host "9️⃣ Deploying databases and Redis..." -ForegroundColor Green
# Note: Update these if SQL and Redis resources exist in your state
terraform plan -target="google_sql_database_instance.main"
terraform plan -target="google_redis_instance.cache"

Write-Host "🔟 Deploying PubSub topics and subscriptions..." -ForegroundColor Green
# Update these with your actual PubSub resources from state
terraform plan -target="google_pubsub_topic.appointment_created"

Write-Host "1️⃣1️⃣ Deploying secrets and service accounts..." -ForegroundColor Green
terraform apply -target="random_password.appointment_service_password" -auto-approve
terraform apply -target="random_password.doctor_service_password" -auto-approve
terraform apply -target="random_password.medical_records_password" -auto-approve
terraform apply -target="random_password.patient_service_password" -auto-approve

terraform apply -target="google_secret_manager_secret.appointment_service_db_password" -auto-approve
terraform apply -target="google_secret_manager_secret.medical_records_db_password" -auto-approve
terraform apply -target="google_secret_manager_secret.patient_service_db_password" -auto-approve
terraform apply -target="google_secret_manager_secret.github_webhook" -auto-approve

terraform apply -target="google_service_account.medical_records_service_account" -auto-approve
terraform apply -target="google_service_account.pubsub_publisher" -auto-approve
terraform apply -target="google_service_account.pubsub_subscriber" -auto-approve

# Deploy everything else
Write-Host "1️⃣2️⃣ Completing deployment..." -ForegroundColor Green
terraform apply -auto-approve

# Get Kubernetes credentials
Write-Host "1️⃣3️⃣ Getting Kubernetes credentials..." -ForegroundColor Green
gcloud container clusters get-credentials healthcare-system-dev --region $REGION

# Create namespace if it doesn't exist
Write-Host "1️⃣4️⃣ Creating Kubernetes namespace..." -ForegroundColor Green
$EXISTING_NS = kubectl get namespace | Select-String "healthcare-system"
if (-not $EXISTING_NS) {
    kubectl create namespace healthcare-system
} else {
    Write-Host "   Namespace healthcare-system already exists." -ForegroundColor Yellow
}

# Create secrets
Write-Host "1️⃣5️⃣ Creating Kubernetes secrets..." -ForegroundColor Green
$DB_PASSWORD = -join ((65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object { [char]$_ })
$JWT_SECRET = -join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })

# Create general secrets
kubectl create secret generic google-api-credentials `
    --namespace healthcare-system `
    --from-literal=api_key=$API_KEY `
    --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic jwt-secret `
    --namespace healthcare-system `
    --from-literal=value=$JWT_SECRET `
    --dry-run=client -o yaml | kubectl apply -f -

# Create service-specific DB credentials
foreach ($SERVICE in $SERVICES) {
    Write-Host "   Creating secrets for $SERVICE..." -ForegroundColor Yellow
    kubectl create secret generic "$SERVICE-db-credentials" `
        --namespace healthcare-system `
        --from-literal=username="$SERVICE-user" `
        --from-literal=password=$DB_PASSWORD `
        --from-literal=host="healthcare-db-$ENVIRONMENT" `
        --from-literal=port="5432" `
        --dry-run=client -o yaml | kubectl apply -f -
}

# Generate and apply Kubernetes manifests
Write-Host "1️⃣6️⃣ Generating and applying Kubernetes manifests..." -ForegroundColor Green
Push-Location ..
foreach ($SERVICE in $SERVICES) {
    if (-not (Test-Path "kubernetes/$SERVICE")) {
        New-Item -ItemType Directory -Path "kubernetes/$SERVICE" -Force | Out-Null
    }
    
    Write-Host "   Creating deployment for $SERVICE..." -ForegroundColor Yellow
    
    @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $SERVICE
  namespace: healthcare-system
  labels:
    app: $SERVICE
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $SERVICE
  template:
    metadata:
      labels:
        app: $SERVICE
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: $SERVICE-sa
      containers:
      - name: $SERVICE
        image: $DOCKER_USERNAME/$SERVICE`:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "8080"
        - name: DB_NAME
          value: "$($SERVICE.Replace("-", "_"))"
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: $SERVICE-db-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: $SERVICE-db-credentials
              key: password
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: $SERVICE-db-credentials
              key: host
        - name: DB_PORT
          valueFrom:
            secretKeyRef:
              name: $SERVICE-db-credentials
              key: port
        - name: DB_SSL
          value: "true"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: value
        - name: GOOGLE_API_KEY
          valueFrom:
            secretKeyRef:
              name: google-api-credentials
              key: api_key
        - name: LOG_LEVEL
          value: "info"
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: $SERVICE
  namespace: healthcare-system
  labels:
    app: $SERVICE
spec:
  selector:
    app: $SERVICE
  ports:
  - port: 8080
    targetPort: 8080
    name: http
  type: ClusterIP
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: $SERVICE-sa
  namespace: healthcare-system
"@ | Out-File -FilePath "kubernetes/$SERVICE/deployment.yaml" -Encoding ASCII

    Write-Host "   Applying deployment for $SERVICE..." -ForegroundColor Yellow
    kubectl apply -f "kubernetes/$SERVICE/deployment.yaml"
}

# Create API Gateway
Write-Host "1️⃣7️⃣ Creating API Gateway..." -ForegroundColor Green

@"
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: healthcare-system
spec:
  selector:
    app: api-gateway
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: healthcare-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: nginx:latest
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: nginx-config
        configMap:
          name: nginx-config
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: healthcare-system
data:
  default.conf: |
    server {
      listen 8080;
      
      location /api/appointments {
        proxy_pass http://appointment-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
      }
      
      location /api/patients {
        proxy_pass http://patient-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
      }
      
      location /api/doctors {
        proxy_pass http://doctor-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
      }
      
      location /api/notifications {
        proxy_pass http://notification-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
      }
      
      location /api/medical-records {
        proxy_pass http://medical-records-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
      }
    }
"@ | Out-File -FilePath "kubernetes/api-gateway.yaml" -Encoding ASCII

kubectl apply -f "kubernetes/api-gateway.yaml"
Pop-Location

# Verify deployments
Write-Host "1️⃣8️⃣ Verifying deployments..." -ForegroundColor Green
kubectl get deployments -n healthcare-system
kubectl get services -n healthcare-system
kubectl get pods -n healthcare-system

# Get external IP
Write-Host "1️⃣9️⃣ Getting external IP for API Gateway..." -ForegroundColor Green
$attempts = 0
$maxAttempts = 10
$externalIP = $null

while ($attempts -lt $maxAttempts) {
    $service = kubectl get service api-gateway -n healthcare-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ($service) {
        $externalIP = $service
        break
    }
    $attempts++
    Write-Host "   Waiting for external IP... (attempt $attempts/$maxAttempts)" -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

if ($externalIP) {
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Cyan
    Write-Host "🌐 API Gateway is available at: http://$externalIP" -ForegroundColor Green
    Write-Host "   You can access services at:" -ForegroundColor Cyan
    Write-Host "   - http://$externalIP/api/appointments" -ForegroundColor Yellow
    Write-Host "   - http://$externalIP/api/patients" -ForegroundColor Yellow
    Write-Host "   - http://$externalIP/api/doctors" -ForegroundColor Yellow
    Write-Host "   - http://$externalIP/api/notifications" -ForegroundColor Yellow
    Write-Host "   - http://$externalIP/api/medical-records" -ForegroundColor Yellow
} else {
    Write-Host "⚠️ API Gateway is still provisioning. Check status with:" -ForegroundColor Yellow
    Write-Host "   kubectl get service api-gateway -n healthcare-system" -ForegroundColor Cyan
}

Write-Host "🏁 Terraform deployment completed!" -ForegroundColor Cyan 