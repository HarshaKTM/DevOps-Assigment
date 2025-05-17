#!/usr/bin/env pwsh

# Healthcare System Health Check
Write-Host "🔍 Healthcare System Health Check" -ForegroundColor Cyan

# Set variables
$NAMESPACE = "healthcare-system"
$PROJECT_ID = "eastern-period-459411-i8"
$SQL_INSTANCE = "eastern-period-459411-i8"
$SERVICES = @(
    "auth-service",
    "doctor-service",
    "patient-service",
    "appointment-service",
    "medical-records-service"
)

# Check Kubernetes connection
Write-Host "1️⃣ Verifying Kubernetes connection..." -ForegroundColor Green
$K8S_CONTEXT = kubectl config current-context 2>$null

if (-not $K8S_CONTEXT) {
    Write-Host "❌ Not connected to any Kubernetes cluster. Please set up GKE connection:" -ForegroundColor Red
    Write-Host "   gcloud container clusters get-credentials [CLUSTER_NAME] --region asia-south1 --project $PROJECT_ID" -ForegroundColor White
    exit 1
} else {
    Write-Host "✅ Connected to Kubernetes context: $K8S_CONTEXT" -ForegroundColor Green
}

# Check if namespace exists
Write-Host "2️⃣ Checking namespace..." -ForegroundColor Green
$NS_EXISTS = kubectl get namespace $NAMESPACE 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Namespace $NAMESPACE does not exist" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Namespace $NAMESPACE exists" -ForegroundColor Green
}

# Check deployments
Write-Host "3️⃣ Checking deployments..." -ForegroundColor Green
$ALL_DEPLOYMENTS_READY = $true

foreach ($SERVICE in $SERVICES) {
    $DEPLOYMENT = kubectl get deployment $SERVICE -n $NAMESPACE 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Deployment $SERVICE does not exist" -ForegroundColor Red
        $ALL_DEPLOYMENTS_READY = $false
        continue
    }
    
    $DEPLOYMENT_STATUS = kubectl get deployment $SERVICE -n $NAMESPACE -o jsonpath="{.status.readyReplicas}/{.status.replicas}"
    if ($DEPLOYMENT_STATUS -eq "0/1" -or $null -eq $DEPLOYMENT_STATUS) {
        Write-Host "❌ Deployment $SERVICE is not ready: $DEPLOYMENT_STATUS" -ForegroundColor Red
        $ALL_DEPLOYMENTS_READY = $false
    } else {
        Write-Host "✅ Deployment $SERVICE is ready: $DEPLOYMENT_STATUS" -ForegroundColor Green
    }
}

# Check pods
Write-Host "4️⃣ Checking pod status..." -ForegroundColor Green
$PODS = kubectl get pods -n $NAMESPACE -o jsonpath="{range .items[*]}{.metadata.name},{.status.phase},{.status.containerStatuses[*].ready}{'\n'}{end}"

if ($PODS) {
    foreach ($POD in $PODS.Split("`n")) {
        if ($POD.Trim() -eq "") { continue }
        
        $POD_INFO = $POD.Split(",")
        $POD_NAME = $POD_INFO[0]
        $POD_PHASE = $POD_INFO[1]
        $CONTAINERS_READY = $POD_INFO[2]
        
        if ($POD_PHASE -ne "Running" -or $CONTAINERS_READY -match "false") {
            Write-Host "❌ Pod $POD_NAME is not healthy: Phase=$POD_PHASE, Ready=$CONTAINERS_READY" -ForegroundColor Red
            
            # Get pod events for troubleshooting
            Write-Host "   Events for $POD_NAME:" -ForegroundColor Yellow
            kubectl get events -n $NAMESPACE --field-selector involvedObject.name=$POD_NAME
            
            # Get pod logs for troubleshooting
            Write-Host "   Logs for $POD_NAME:" -ForegroundColor Yellow
            kubectl logs -n $NAMESPACE $POD_NAME --tail=20
        } else {
            Write-Host "✅ Pod $POD_NAME is healthy: Phase=$POD_PHASE" -ForegroundColor Green
        }
    }
} else {
    Write-Host "❌ No pods found in namespace $NAMESPACE" -ForegroundColor Red
}

# Check services
Write-Host "5️⃣ Checking services..." -ForegroundColor Green
foreach ($SERVICE in $SERVICES) {
    $SVC = kubectl get service $SERVICE -n $NAMESPACE 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Service $SERVICE does not exist" -ForegroundColor Red
        continue
    }
    
    $ENDPOINTS = kubectl get endpoints $SERVICE -n $NAMESPACE -o jsonpath="{.subsets[*].addresses[*]}"
    if ($null -eq $ENDPOINTS -or $ENDPOINTS -eq "") {
        Write-Host "❌ Service $SERVICE has no endpoints" -ForegroundColor Red
    } else {
        Write-Host "✅ Service $SERVICE has endpoints" -ForegroundColor Green
    }
}

# Check database connection
Write-Host "6️⃣ Checking database connection..." -ForegroundColor Green
$DB_CHECK_POD = @"
apiVersion: v1
kind: Pod
metadata:
  name: db-check
  namespace: $NAMESPACE
spec:
  containers:
  - name: db-check
    image: postgres:14
    command: ['sh', '-c', 'sleep 3600']
  restartPolicy: Never
"@

Write-Host "   Creating temporary pod for database check..." -ForegroundColor Yellow
$DB_CHECK_POD | Out-File -FilePath "db-check-pod.yaml" -Encoding utf8
kubectl apply -f "db-check-pod.yaml"

# Wait for the pod to be ready
$POD_READY = $false
$TIMEOUT = 60 # seconds
$START_TIME = Get-Date

Write-Host "   Waiting for test pod to be ready..." -ForegroundColor Yellow

while (-not $POD_READY -and ((Get-Date) - $START_TIME).TotalSeconds -lt $TIMEOUT) {
    $POD_STATUS = kubectl get pod db-check -n $NAMESPACE -o jsonpath="{.status.phase}" 2>$null
    if ($POD_STATUS -eq "Running") {
        $POD_READY = $true
    } else {
        Start-Sleep -Seconds 2
    }
}

if ($POD_READY) {
    Write-Host "   Test pod is ready. Checking database connections..." -ForegroundColor Green
    
    # Check each database connection
    foreach ($DB in $SERVICES) {
        $DB_NAME = $DB.Replace("-", "_")
        $DB_SECRET = "$DB-db-credentials"
        
        # Get credentials from secret
        $DB_HOST = kubectl get secret $DB_SECRET -n $NAMESPACE -o jsonpath="{.data.host}" 2>$null | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
        $DB_PORT = kubectl get secret $DB_SECRET -n $NAMESPACE -o jsonpath="{.data.port}" 2>$null | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
        $DB_USER = kubectl get secret $DB_SECRET -n $NAMESPACE -o jsonpath="{.data.username}" 2>$null | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
        $DB_PASS = kubectl get secret $DB_SECRET -n $NAMESPACE -o jsonpath="{.data.password}" 2>$null | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
        
        if (-not $DB_HOST -or -not $DB_PORT -or -not $DB_USER -or -not $DB_PASS) {
            Write-Host "❌ Database credentials for $DB not found" -ForegroundColor Red
            continue
        }
        
        # Try to connect
        $PGPASSWORD_ENV = "PGPASSWORD=$DB_PASS"
        $CONNECTION_CMD = "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c 'SELECT 1;'"
        $CONNECTION_OUTPUT = kubectl exec -n $NAMESPACE db-check -- bash -c "$PGPASSWORD_ENV $CONNECTION_CMD" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database connection to $DB_NAME successful" -ForegroundColor Green
        } else {
            Write-Host "❌ Database connection to $DB_NAME failed: $CONNECTION_OUTPUT" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Test pod did not become ready within timeout period" -ForegroundColor Red
}

# Clean up test pod
Write-Host "   Cleaning up test pod..." -ForegroundColor Yellow
kubectl delete -f "db-check-pod.yaml" --wait=false
Remove-Item "db-check-pod.yaml"

# Check ingress
Write-Host "7️⃣ Checking ingress..." -ForegroundColor Green
$INGRESS = kubectl get ingress -n $NAMESPACE 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No ingress resources found in namespace $NAMESPACE" -ForegroundColor Red
} else {
    $INGRESS_LIST = kubectl get ingress -n $NAMESPACE -o jsonpath="{range .items[*]}{.metadata.name},{.status.loadBalancer.ingress[0].ip}{'\n'}{end}"
    
    foreach ($ING in $INGRESS_LIST.Split("`n")) {
        if ($ING.Trim() -eq "") { continue }
        
        $INGRESS_INFO = $ING.Split(",")
        $INGRESS_NAME = $INGRESS_INFO[0]
        $INGRESS_IP = $INGRESS_INFO[1]
        
        if ($INGRESS_IP) {
            Write-Host "✅ Ingress $INGRESS_NAME is ready with IP: $INGRESS_IP" -ForegroundColor Green
            
            # Check if services are properly configured in ingress
            $INGRESS_RULES = kubectl get ingress $INGRESS_NAME -n $NAMESPACE -o jsonpath="{.spec.rules[0].http.paths[*].backend.service.name}"
            Write-Host "   Services exposed through ingress: $INGRESS_RULES" -ForegroundColor Green
        } else {
            Write-Host "❌ Ingress $INGRESS_NAME does not have an IP address assigned" -ForegroundColor Red
        }
    }
}

# Check Cloud SQL status
Write-Host "8️⃣ Checking Cloud SQL instance status..." -ForegroundColor Green
try {
    $SQL_STATUS = gcloud sql instances describe $SQL_INSTANCE --format="value(state)" 2>$null
    if ($SQL_STATUS -eq "RUNNABLE") {
        Write-Host "✅ Cloud SQL instance $SQL_INSTANCE is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Cloud SQL instance $SQL_INSTANCE status: $SQL_STATUS" -ForegroundColor Red
    }
    
    # List databases
    Write-Host "   Databases on instance:" -ForegroundColor Yellow
    gcloud sql databases list --instance=$SQL_INSTANCE
} catch {
    Write-Host "❌ Failed to retrieve Cloud SQL instance information" -ForegroundColor Red
}

# Check logging and monitoring
Write-Host "9️⃣ Checking logging and monitoring..." -ForegroundColor Green

# Check for Fluent Bit DaemonSet
$FLUENT_BIT = kubectl get daemonset fluent-bit -n $NAMESPACE 2>$null
if ($LASTEXITCODE -eq 0) {
    $FB_STATUS = kubectl get daemonset fluent-bit -n $NAMESPACE -o jsonpath="{.status.numberReady}/{.status.desiredNumberScheduled}"
    Write-Host "✅ Fluent Bit DaemonSet is running: $FB_STATUS" -ForegroundColor Green
} else {
    Write-Host "❌ Fluent Bit DaemonSet not found" -ForegroundColor Red
}

# Display final summary
Write-Host ""
Write-Host "📊 Healthcare System Health Check Summary" -ForegroundColor Cyan
if ($ALL_DEPLOYMENTS_READY) {
    Write-Host "✅ All deployments are ready" -ForegroundColor Green
} else {
    Write-Host "❌ Some deployments are not ready. Check details above." -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Fix any issues highlighted above" -ForegroundColor White
Write-Host "   2. For detailed service logs, run:" -ForegroundColor White
Write-Host "      kubectl logs -n $NAMESPACE deployment/<service-name>" -ForegroundColor White
Write-Host "   3. To access the application, use the Ingress IP address from above" -ForegroundColor White
Write-Host "   4. View logs in Google Cloud Console: https://console.cloud.google.com/logs/query" -ForegroundColor White 