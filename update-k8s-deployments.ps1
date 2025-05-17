# Update Kubernetes Deployments with Google Container Registry Images
Write-Host "🚀 Updating Kubernetes Deployments with GCR Images" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$CLUSTER_NAME = "healthcare-system-dev"
$NAMESPACE = "healthcare-system"
$GCR_HOSTNAME = "gcr.io"
$SERVICES = @("appointment-service", "patient-service", "doctor-service", "notification-service", "medical-records-service", "auth-service")

# 1. Get GKE credentials
Write-Host "1️⃣ Getting GKE cluster credentials..." -ForegroundColor Green
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION

# 2. Update Kubernetes deployment files with GCR image references
Write-Host "2️⃣ Updating deployment files with GCR image references..." -ForegroundColor Green

foreach ($SERVICE in $SERVICES) {
    $DEPLOYMENT_DIR = "kubernetes/$SERVICE"
    if (-not (Test-Path $DEPLOYMENT_DIR)) {
        Write-Host "   Creating directory for $SERVICE deployments..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $DEPLOYMENT_DIR -Force | Out-Null
    }
    
    Write-Host "   Creating/updating deployment for $SERVICE..." -ForegroundColor Yellow
    
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
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
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
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
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

# 3. Create frontend deployment
Write-Host "3️⃣ Creating/updating Frontend deployment..." -ForegroundColor Green
$FRONTEND_DIR = "kubernetes/frontend"
if (-not (Test-Path $FRONTEND_DIR)) {
    New-Item -ItemType Directory -Path $FRONTEND_DIR -Force | Out-Null
}

$FRONTEND_DEPLOYMENT = "$FRONTEND_DIR/deployment.yaml"
@"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: $NAMESPACE
  labels:
    app: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: $GCR_HOSTNAME/$PROJECT_ID/frontend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
          name: http
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 300m
            memory: 256Mi
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: $NAMESPACE
  labels:
    app: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    name: http
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: healthcare-ingress
  namespace: $NAMESPACE
  annotations:
    kubernetes.io/ingress.class: "gce"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: appointment-service
            port:
              number: 8080
"@ | Out-File -FilePath $FRONTEND_DEPLOYMENT -Encoding ASCII

Write-Host "4️⃣ Applying updated Kubernetes manifests..." -ForegroundColor Green
# Apply all the services
foreach ($SERVICE in $SERVICES) {
    Write-Host "   Applying manifest for $SERVICE..." -ForegroundColor Yellow
    kubectl apply -f "kubernetes/$SERVICE/deployment.yaml"
}

# Apply frontend
Write-Host "   Applying manifest for frontend..." -ForegroundColor Yellow
kubectl apply -f "kubernetes/frontend/deployment.yaml"

# Verify deployments
Write-Host "5️⃣ Verifying deployments..." -ForegroundColor Green
kubectl get deployments -n $NAMESPACE

Write-Host "✅ Kubernetes deployments updated successfully!" -ForegroundColor Green
Write-Host "📝 Note: If you need to check deployment status, run: kubectl get pods -n $NAMESPACE" -ForegroundColor Yellow 