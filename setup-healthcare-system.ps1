#!/usr/bin/env pwsh

# Healthcare System Setup Script
Write-Host "🚀 Setting up Healthcare System with Logging and Cloud SQL Connection" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$ZONE = "asia-south1-a"
$NAMESPACE = "healthcare-system"
$SQL_INSTANCE_CONNECTION = "eastern-period-459411-i8:asia-south1:eastern-period-459411-i8"
$ROOT_PASSWORD = "ChangeMe123!" # Change this to a secure password in production
$DBS = @(
    "auth_service",
    "doctor_service",
    "patient_service",
    "appointment_service",
    "medical_records_service"
)

# Check Google Cloud authentication
Write-Host "1️⃣ Verifying Google Cloud authentication..." -ForegroundColor Green
$GCP_AUTH = gcloud auth list --filter=status:ACTIVE --format="value(account)"

if (-not $GCP_AUTH) {
    Write-Host "   Not authenticated to Google Cloud. Please run 'gcloud auth login'" -ForegroundColor Red
    exit 1
} else {
    Write-Host "   Authenticated as $GCP_AUTH" -ForegroundColor Green
}

# Check Kubernetes connection
Write-Host "2️⃣ Verifying Kubernetes connection..." -ForegroundColor Green
$K8S_CONTEXT = kubectl config current-context 2>$null

if (-not $K8S_CONTEXT) {
    Write-Host "   Not connected to any Kubernetes cluster. Please set up GKE connection:" -ForegroundColor Red
    Write-Host "   gcloud container clusters get-credentials [CLUSTER_NAME] --region $REGION --project $PROJECT_ID" -ForegroundColor White
    exit 1
} else {
    Write-Host "   Connected to Kubernetes context: $K8S_CONTEXT" -ForegroundColor Green
}

# Ensure namespace exists
Write-Host "3️⃣ Ensuring namespace exists..." -ForegroundColor Green
kubectl get namespace $NAMESPACE 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Creating namespace $NAMESPACE..." -ForegroundColor Yellow
    kubectl create namespace $NAMESPACE
} else {
    Write-Host "   Namespace $NAMESPACE already exists." -ForegroundColor Green
}

# Setup logging for the services
Write-Host "4️⃣ Setting up logging for services..." -ForegroundColor Green

# Create logging ConfigMap
$LOGGING_CONFIG = @"
apiVersion: v1
kind: ConfigMap
metadata:
  name: logging-config
  namespace: $NAMESPACE
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         1
        Log_Level     info
        Daemon        off
        Parsers_File  parsers.conf

    [INPUT]
        Name          tail
        Path          /var/log/containers/*$NAMESPACE*.log
        Parser        docker
        Tag           kube.*
        Mem_Buf_Limit 5MB
        Skip_Long_Lines On

    [FILTER]
        Name          kubernetes
        Match         kube.*
        Kube_URL      https://kubernetes.default.svc.cluster.local:443
        Merge_Log     On
        K8S-Logging.Parser On
        K8S-Logging.Exclude Off

    [OUTPUT]
        Name          stackdriver
        Match         *
        google_service_credentials /var/run/secrets/google/key.json
        project_id    $PROJECT_ID

  parsers.conf: |
    [PARSER]
        Name          docker
        Format        json
        Time_Key      time
        Time_Format   %Y-%m-%dT%H:%M:%S.%L
        Time_Keep     On
"@

$LOGGING_CONFIG | Out-File -FilePath "logging-config.yaml" -Encoding utf8
kubectl apply -f "logging-config.yaml"

# Create a service account for logging
Write-Host "   Setting up service account for logging..." -ForegroundColor Yellow
$LOGGING_SA_NAME = "healthcare-logging-sa"

# Check if service account exists
$SA_EXISTS = gcloud iam service-accounts list --filter="email:$LOGGING_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" --format="value(email)"
if (-not $SA_EXISTS) {
    gcloud iam service-accounts create $LOGGING_SA_NAME --display-name="Healthcare Logging Service Account"
}

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$LOGGING_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" `
    --role="roles/logging.logWriter"

# Create service account key
gcloud iam service-accounts keys create "healthcare-logging-key.json" `
    --iam-account="$LOGGING_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Create Kubernetes secret for logging
kubectl create secret generic logging-credentials `
    --namespace $NAMESPACE `
    --from-file=key.json=healthcare-logging-key.json `
    --dry-run=client -o yaml | kubectl apply -f -

# Deploy Fluent Bit DaemonSet
$FLUENT_BIT_DAEMON = @"
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: $NAMESPACE
  labels:
    app: fluent-bit
    k8s-app: fluent-bit-logging
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    metadata:
      labels:
        app: fluent-bit
        k8s-app: fluent-bit-logging
    spec:
      containers:
      - name: fluent-bit
        image: fluent/fluent-bit:1.9.9
        volumeMounts:
        - name: logging-config
          mountPath: /fluent-bit/etc/
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: logging-credentials
          mountPath: /var/run/secrets/google
          readOnly: true
      terminationGracePeriodSeconds: 30
      volumes:
      - name: logging-config
        configMap:
          name: logging-config
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: logging-credentials
        secret:
          secretName: logging-credentials
"@

$FLUENT_BIT_DAEMON | Out-File -FilePath "fluent-bit-daemonset.yaml" -Encoding utf8
kubectl apply -f "fluent-bit-daemonset.yaml"

# Set up Cloud SQL connection
Write-Host "5️⃣ Setting up Cloud SQL connection..." -ForegroundColor Green

# Create service account for Cloud SQL
$SQL_SA_NAME = "healthcare-sql-client"
$SQL_KEY_FILE = "healthcare-sql-client-key.json"

# Check if service account exists
$SQL_SA_EXISTS = gcloud iam service-accounts list --filter="email:$SQL_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" --format="value(email)"
if (-not $SQL_SA_EXISTS) {
    Write-Host "   Creating service account $SQL_SA_NAME..." -ForegroundColor Yellow
    gcloud iam service-accounts create $SQL_SA_NAME --display-name="Healthcare SQL Client"
} else {
    Write-Host "   Service account $SQL_SA_NAME already exists." -ForegroundColor Yellow
}

# Create service account key if it doesn't exist
if (-not (Test-Path $SQL_KEY_FILE)) {
    Write-Host "   Creating service account key..." -ForegroundColor Yellow
    gcloud iam service-accounts keys create $SQL_KEY_FILE --iam-account="$SQL_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
} else {
    Write-Host "   Service account key already exists." -ForegroundColor Yellow
}

# Grant necessary permissions
Write-Host "   Granting necessary permissions..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SQL_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" --role="roles/cloudsql.client"

# Get Cloud SQL information
Write-Host "6️⃣ Retrieving Cloud SQL instance information..." -ForegroundColor Green
try {
    $DB_HOST = gcloud sql instances describe --project=$PROJECT_ID eastern-period-459411-i8 --format="value(ipAddresses[0].ipAddress)"
    Write-Host "   Cloud SQL IP: $DB_HOST" -ForegroundColor Green
} catch {
    Write-Host "   Failed to retrieve Cloud SQL information. Please check instance name and permissions." -ForegroundColor Red
    exit 1
}

# Update Kubernetes secrets for database credentials
Write-Host "7️⃣ Creating database connection secrets..." -ForegroundColor Green

foreach ($DB in $DBS) {
    $SERVICE_NAME = $DB.Replace("_", "-")
    Write-Host "   Creating secret for $SERVICE_NAME..." -ForegroundColor Yellow
    
    kubectl create secret generic "$SERVICE_NAME-db-credentials" `
        --namespace $NAMESPACE `
        --from-literal=username="postgres" `
        --from-literal=password=$ROOT_PASSWORD `
        --from-literal=host=$DB_HOST `
        --from-literal=port="5432" `
        --from-literal=database=$DB `
        --from-literal=instance_connection_name=$SQL_INSTANCE_CONNECTION `
        --dry-run=client -o yaml | kubectl apply -f -
}

# Create Cloud SQL proxy sidecar config
Write-Host "8️⃣ Creating Cloud SQL proxy configuration for services..." -ForegroundColor Green

$SQL_PROXY_CONFIG = @"
apiVersion: v1
kind: ConfigMap
metadata:
  name: cloudsql-proxy-config
  namespace: $NAMESPACE
data:
  sql-proxy-service.json: |
    {
      "instances": [
        {
          "connectionName": "$SQL_INSTANCE_CONNECTION",
          "port": 5432
        }
      ]
    }
"@

$SQL_PROXY_CONFIG | Out-File -FilePath "cloudsql-proxy-config.yaml" -Encoding utf8
kubectl apply -f "cloudsql-proxy-config.yaml"

# Create Kubernetes secret for SQL proxy service account key
kubectl create secret generic cloudsql-proxy-credentials `
    --namespace $NAMESPACE `
    --from-file=credentials.json=$SQL_KEY_FILE `
    --dry-run=client -o yaml | kubectl apply -f -

# Update deployments to use Cloud SQL proxy
Write-Host "9️⃣ Checking service deployments..." -ForegroundColor Green

# Function to update deployment with Cloud SQL proxy sidecar
function Update-ServiceDeployment {
    param (
        [string]$Service
    )
    
    Write-Host "   Checking deployment for $Service..." -ForegroundColor Yellow
    
    $deploymentExists = kubectl get deployment $Service -n $NAMESPACE 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Updating deployment for $Service with Cloud SQL proxy..." -ForegroundColor Green
        
        # Get current deployment
        $deployment = kubectl get deployment $Service -n $NAMESPACE -o json | ConvertFrom-Json
        
        # Check if proxy container already exists
        $hasProxyContainer = $false
        foreach ($container in $deployment.spec.template.spec.containers) {
            if ($container.name -eq "cloudsql-proxy") {
                $hasProxyContainer = $true
                break
            }
        }
        
        if (-not $hasProxyContainer) {
            # Add Cloud SQL proxy container
            $proxyContainer = @{
                name = "cloudsql-proxy"
                image = "gcr.io/cloudsql-docker/gce-proxy:1.30.1"
                command = @(
                    "/cloud_sql_proxy"
                    "-instances=$SQL_INSTANCE_CONNECTION=tcp:5432"
                    "-credential_file=/secrets/cloudsql/credentials.json"
                )
                volumeMounts = @(
                    @{
                        name = "cloudsql-proxy-credentials"
                        mountPath = "/secrets/cloudsql"
                        readOnly = $true
                    }
                )
            }
            
            # Add volume for credentials
            $credentialsVolume = @{
                name = "cloudsql-proxy-credentials"
                secret = @{
                    secretName = "cloudsql-proxy-credentials"
                }
            }
            
            # Convert to JSON and apply
            $deployment.spec.template.spec.containers += $proxyContainer
            if (-not $deployment.spec.template.spec.volumes) {
                $deployment.spec.template.spec.volumes = @()
            }
            $deployment.spec.template.spec.volumes += $credentialsVolume
            
            $deployment | ConvertTo-Json -Depth 20 | Out-File "temp-deployment.json"
            kubectl apply -f "temp-deployment.json"
            Remove-Item "temp-deployment.json"
            
            Write-Host "   Updated deployment for $Service with Cloud SQL proxy" -ForegroundColor Green
        } else {
            Write-Host "   $Service already has Cloud SQL proxy sidecar" -ForegroundColor Green
        }
    } else {
        Write-Host "   Deployment for $Service not found." -ForegroundColor Yellow
    }
}

# Update each service deployment
foreach ($DB in $DBS) {
    $SERVICE_NAME = $DB.Replace("_", "-")
    Update-ServiceDeployment -Service $SERVICE_NAME
}

# Restart deployments
Write-Host "🔄 Restarting deployments to apply changes..." -ForegroundColor Green
kubectl rollout restart deployment -n $NAMESPACE

# Display summary
Write-Host "✅ Healthcare System Setup Completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary of What Was Set Up:" -ForegroundColor Cyan
Write-Host "   ✓ Logging with Fluent Bit sending logs to Google Cloud Logging" -ForegroundColor White
Write-Host "   ✓ Cloud SQL connection using proxy sidecars" -ForegroundColor White
Write-Host "   ✓ Database connection secrets for all services" -ForegroundColor White
Write-Host "   ✓ Service account credentials for both logging and Cloud SQL" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Check if services are running properly:" -ForegroundColor White
Write-Host "      kubectl get pods -n $NAMESPACE" -ForegroundColor White
Write-Host "   2. Check service logs:" -ForegroundColor White
Write-Host "      kubectl logs -n $NAMESPACE deployment/auth-service" -ForegroundColor White
Write-Host "   3. Check database connectivity for each service from their logs" -ForegroundColor White
Write-Host "   4. View logs in Google Cloud Console: https://console.cloud.google.com/logs/query" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To verify everything is working correctly, run:" -ForegroundColor Yellow
Write-Host "   kubectl get pods -n $NAMESPACE" -ForegroundColor White
Write-Host "   kubectl describe pods -n $NAMESPACE" -ForegroundColor White 