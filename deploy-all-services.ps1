# Healthcare System Deployment Script
Write-Host "🚀 Starting Healthcare System Deployment" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$CLUSTER_NAME = "healthcare-system-dev"
$NAMESPACE = "healthcare-system"
$API_KEY = "AIzaSyDQbDhz5tkFBer7x0t2Uw_bVZqooRtRANc"
$DOCKER_USERNAME = "harsha098"
$SERVICES = @("appointment-service", "patient-service", "doctor-service", "notification-service", "medical-records-service")

# 1. Login and setup
Write-Host "1️⃣ Setting up Google Cloud..." -ForegroundColor Green
gcloud config set project $PROJECT_ID

# 2. Enable APIs
Write-Host "2️⃣ Enabling required APIs..." -ForegroundColor Green
$APIS = @(
    "container.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com", 
    "cloudbuild.googleapis.com",
    "pubsub.googleapis.com",
    "cloudkms.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "artifactregistry.googleapis.com"
)

foreach ($API in $APIS) {
    Write-Host "   Enabling $API..." -ForegroundColor Yellow
    gcloud services enable $API
}

# 3. Create GKE cluster if it doesn't exist
Write-Host "3️⃣ Creating/Connecting to GKE cluster..." -ForegroundColor Green
$CLUSTERS = gcloud container clusters list --format="value(name)" | Select-String $CLUSTER_NAME
if (-not $CLUSTERS) {
    Write-Host "   Creating new cluster $CLUSTER_NAME in $REGION..." -ForegroundColor Yellow
    gcloud container clusters create $CLUSTER_NAME `
        --region $REGION `
        --num-nodes 1 `
        --machine-type e2-standard-2
} else {
    Write-Host "   Cluster $CLUSTER_NAME already exists." -ForegroundColor Yellow
}

# 4. Get credentials
Write-Host "4️⃣ Getting cluster credentials..." -ForegroundColor Green
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION

# 5. Create namespace if it doesn't exist
Write-Host "5️⃣ Creating namespace $NAMESPACE..." -ForegroundColor Green
$EXISTING_NS = kubectl get namespace | Select-String $NAMESPACE
if (-not $EXISTING_NS) {
    kubectl create namespace $NAMESPACE
} else {
    Write-Host "   Namespace $NAMESPACE already exists." -ForegroundColor Yellow
}

# 6. Create secrets
Write-Host "6️⃣ Creating secrets..." -ForegroundColor Green
$DB_PASSWORD = -join ((65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object { [char]$_ })
$JWT_SECRET = -join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })

# Create general secrets
kubectl create secret generic google-api-credentials `
    --namespace $NAMESPACE `
    --from-literal=api_key=$API_KEY `
    --dry-run=client -o yaml | kubectl apply -f -

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

# 7. Build and push Docker images
Write-Host "7️⃣ Building and pushing Docker images..." -ForegroundColor Green
foreach ($SERVICE in $SERVICES) {
    # Only build if the directory exists
    if (Test-Path "../services/$SERVICE") {
        Write-Host "   Processing $SERVICE..." -ForegroundColor Yellow
        Push-Location "../services/$SERVICE"
        
        # Build and push the Docker image
        if (Test-Path "Dockerfile") {
            Write-Host "   Building and pushing $SERVICE image..." -ForegroundColor Yellow
            docker build -t "$DOCKER_USERNAME/$SERVICE`:latest" .
            docker push "$DOCKER_USERNAME/$SERVICE`:latest"
        } else {
            Write-Host "   Dockerfile not found for $SERVICE, creating simple Dockerfile..." -ForegroundColor Red
            # Create a simple Dockerfile if one doesn't exist
            @"
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
"@ | Out-File -FilePath "Dockerfile" -Encoding ASCII
            
            Write-Host "   Building and pushing $SERVICE with generated Dockerfile..." -ForegroundColor Yellow
            docker build -t "$DOCKER_USERNAME/$SERVICE`:latest" .
            docker push "$DOCKER_USERNAME/$SERVICE`:latest"
        }
        
        Pop-Location
    } else {
        Write-Host "   Service directory for $SERVICE not found, skipping..." -ForegroundColor Red
    }
}

# 8. Create or update Kubernetes deployment files
Write-Host "8️⃣ Creating Kubernetes deployment files..." -ForegroundColor Green
foreach ($SERVICE in $SERVICES) {
    if (-not (Test-Path "../kubernetes/$SERVICE")) {
        New-Item -ItemType Directory -Path "../kubernetes/$SERVICE" -Force | Out-Null
    }
    
    Write-Host "   Creating deployment for $SERVICE..." -ForegroundColor Yellow
    
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
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: $SERVICE-sa
  namespace: $NAMESPACE
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: $SERVICE-configmap
  namespace: $NAMESPACE
data:
  logging.json: |
    {
      "level": "info",
      "format": "json",
      "service": "$SERVICE"
    }
"@ | Out-File -FilePath "../kubernetes/$SERVICE/deployment.yaml" -Encoding ASCII
}

# 9. Deploy all services
Write-Host "9️⃣ Deploying all services..." -ForegroundColor Green
foreach ($SERVICE in $SERVICES) {
    Write-Host "   Deploying $SERVICE..." -ForegroundColor Yellow
    kubectl apply -f "../kubernetes/$SERVICE/deployment.yaml"
}

# 10. Create API Gateway
Write-Host "🔟 Creating API Gateway..." -ForegroundColor Green

@"
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: $NAMESPACE
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
  namespace: $NAMESPACE
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
  namespace: $NAMESPACE
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
"@ | Out-File -FilePath "../kubernetes/api-gateway.yaml" -Encoding ASCII

kubectl apply -f "../kubernetes/api-gateway.yaml"

# 11. Verify deployments
Write-Host "1️⃣1️⃣ Verifying deployments..." -ForegroundColor Green
kubectl get deployments -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get pods -n $NAMESPACE

# 12. Setup Monitoring (Prometheus & Grafana)
Write-Host "1️⃣2️⃣ Setting up monitoring..." -ForegroundColor Green

# Check if Helm is installed
$helmVersion = helm version
if (-not $?) {
    Write-Host "   ❌ Helm not installed. Please install Helm to set up monitoring." -ForegroundColor Red
} else {
    # Create monitoring namespace if it doesn't exist
    $MONITORING_NS = kubectl get namespace | Select-String "monitoring"
    if (-not $MONITORING_NS) {
        kubectl create namespace monitoring
    } else {
        Write-Host "   Namespace monitoring already exists." -ForegroundColor Yellow
    }
    
    # Add Helm repos
    Write-Host "   Adding Helm repos..." -ForegroundColor Yellow
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update
    
    # Install Prometheus
    Write-Host "   Installing Prometheus..." -ForegroundColor Yellow
    helm install prometheus prometheus-community/prometheus --namespace monitoring --wait
    
    # Install Grafana
    Write-Host "   Installing Grafana..." -ForegroundColor Yellow
    helm install grafana grafana/grafana --namespace monitoring --wait
    
    # Get Grafana admin password
    $GRAFANA_PASSWORD = kubectl get secret -n monitoring grafana -o jsonpath="{.data.admin-password}" | [System.Text.Encoding]::ASCII.GetString([System.Convert]::FromBase64String($_))
    Write-Host "   Grafana admin password: $GRAFANA_PASSWORD" -ForegroundColor Green
    Write-Host "   Save this password! You'll need it to log into Grafana." -ForegroundColor Red
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Cyan
Write-Host "🌐 To access your services:" -ForegroundColor Cyan
Write-Host "   kubectl port-forward -n $NAMESPACE service/api-gateway 8080:80" -ForegroundColor Yellow
Write-Host "   Then open http://localhost:8080/api/appointments" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 To access Grafana monitoring:" -ForegroundColor Cyan
Write-Host "   kubectl port-forward -n monitoring service/grafana 3000:80" -ForegroundColor Yellow
Write-Host "   Then open http://localhost:3000 and login with admin / (password shown above)" -ForegroundColor Yellow 