# Deploy Kubernetes Resources
Write-Host "🚀 Deploying Kubernetes Resources" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$CLUSTER_NAME = "healthcare-system-dev"
$NAMESPACE = "healthcare-system"
$GCR_HOSTNAME = "gcr.io"
$SERVICES = @("auth-service", "medical-records-service")

# 1. Get GKE credentials
Write-Host "1️⃣ Getting GKE cluster credentials..." -ForegroundColor Green
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION

# 2. Create namespace if it doesn't exist
Write-Host "2️⃣ Creating namespace if it doesn't exist..." -ForegroundColor Green
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# 3. Create secrets
Write-Host "3️⃣ Creating secrets..." -ForegroundColor Green
$DB_PASSWORD = "StrongPassword123!"
$JWT_SECRET = "JwtSecretKey123456789"

# Create general secrets
kubectl create secret generic jwt-secret `
    --namespace $NAMESPACE `
    --from-literal=value=$JWT_SECRET `
    --dry-run=client -o yaml | kubectl apply -f -

# Create service-specific DB credentials
foreach ($SERVICE in $SERVICES) {
    Write-Host "   Creating secrets for $SERVICE..." -ForegroundColor Yellow
    kubectl create secret generic "$SERVICE-db-credentials" `
        --namespace $NAMESPACE `
        --from-literal=username="$SERVICE-user" `
        --from-literal=password=$DB_PASSWORD `
        --from-literal=host="healthcare-db" `
        --from-literal=port="5432" `
        --dry-run=client -o yaml | kubectl apply -f -
}

# 4. Create deployment directories
Write-Host "4️⃣ Creating deployment files..." -ForegroundColor Green

foreach ($SERVICE in $SERVICES) {
    $DEPLOYMENT_DIR = "kubernetes/$SERVICE"
    if (-not (Test-Path $DEPLOYMENT_DIR)) {
        Write-Host "   Creating directory for $SERVICE deployments..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $DEPLOYMENT_DIR -Force | Out-Null
    }
    
    Write-Host "   Creating deployment for $SERVICE..." -ForegroundColor Yellow
    
    $DEPLOYMENT_FILE = "$DEPLOYMENT_DIR/deployment.yaml"
    @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $SERVICE
  namespace: $NAMESPACE
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
    spec:
      containers:
      - name: $SERVICE
        image: $GCR_HOSTNAME/$PROJECT_ID/$SERVICE:latest
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
---
apiVersion: v1
kind: Service
metadata:
  name: $SERVICE
  namespace: $NAMESPACE
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
"@ | Out-File -FilePath $DEPLOYMENT_FILE -Encoding ASCII
}

# 5. Apply deployments
Write-Host "5️⃣ Applying deployments..." -ForegroundColor Green
foreach ($SERVICE in $SERVICES) {
    Write-Host "   Applying $SERVICE deployment..." -ForegroundColor Yellow
    kubectl apply -f "kubernetes/$SERVICE/deployment.yaml"
}

# 6. Check deployment status
Write-Host "6️⃣ Checking deployment status..." -ForegroundColor Green
kubectl get deployments -n $NAMESPACE

Write-Host "✅ Kubernetes deployments completed!" -ForegroundColor Green 