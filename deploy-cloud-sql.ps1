# Deploy Cloud SQL Database for Healthcare System
Write-Host "🚀 Deploying Cloud SQL Database for Healthcare System" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$ZONE = "asia-south1-a"
$NETWORK = "default"
$INSTANCE_NAME = "healthcare-db"
$DB_VERSION = "POSTGRES_14"
$TIER = "db-g1-small"
$ROOT_PASSWORD = "ChangeMe123!" # Change this to a secure password in production
$DBS = @(
    "auth_service",
    "doctor_service",
    "patient_service",
    "appointment_service",
    "medical_records_service"
)

# Create service account key for Cloud SQL proxy (if needed)
$SERVICE_ACCOUNT_NAME = "healthcare-sql-client"
$KEY_FILE = "healthcare-sql-client-key.json"

Write-Host "1️⃣ Setting up database service account..." -ForegroundColor Green

# Check if service account exists
$SA_EXISTS = gcloud iam service-accounts list --filter="email:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" --format="value(email)"
if (-not $SA_EXISTS) {
    Write-Host "   Creating service account $SERVICE_ACCOUNT_NAME..." -ForegroundColor Yellow
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME --display-name="Healthcare SQL Client"
} else {
    Write-Host "   Service account $SERVICE_ACCOUNT_NAME already exists." -ForegroundColor Yellow
}

# Create service account key if it doesn't exist
if (-not (Test-Path $KEY_FILE)) {
    Write-Host "   Creating service account key..." -ForegroundColor Yellow
    gcloud iam service-accounts keys create $KEY_FILE --iam-account="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
} else {
    Write-Host "   Service account key already exists." -ForegroundColor Yellow
}

# Grant necessary permissions
Write-Host "   Granting necessary permissions..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" --role="roles/cloudsql.client"

# Check if Cloud SQL instance exists
Write-Host "2️⃣ Checking if Cloud SQL instance exists..." -ForegroundColor Green
$INSTANCE_EXISTS = gcloud sql instances list --filter="name:$INSTANCE_NAME" --format="value(name)"

if (-not $INSTANCE_EXISTS) {
    # Create Cloud SQL instance
    Write-Host "3️⃣ Creating Cloud SQL instance..." -ForegroundColor Green
    gcloud sql instances create $INSTANCE_NAME `
        --database-version=$DB_VERSION `
        --tier=$TIER `
        --region=$REGION `
        --availability-type=ZONAL `
        --storage-size=10 `
        --storage-type=SSD `
        --root-password=$ROOT_PASSWORD `
        --network=$NETWORK `
        --backup-start-time="02:00" `
        --enable-point-in-time-recovery
    
    Write-Host "   Cloud SQL instance created successfully." -ForegroundColor Green
} else {
    Write-Host "   Cloud SQL instance already exists." -ForegroundColor Yellow
}

# Create databases
Write-Host "4️⃣ Creating databases..." -ForegroundColor Green
foreach ($DB in $DBS) {
    # Check if database exists
    $DB_EXISTS = gcloud sql databases list --instance=$INSTANCE_NAME --filter="name:$DB" --format="value(name)" 2>$null
    if (-not $DB_EXISTS) {
        Write-Host "   Creating database $DB..." -ForegroundColor Yellow
        gcloud sql databases create $DB --instance=$INSTANCE_NAME
    } else {
        Write-Host "   Database $DB already exists." -ForegroundColor Yellow
    }
}

# Create Cloud SQL Proxy for local connection (requires the Cloud SQL Proxy executable)
Write-Host "5️⃣ Setting up Cloud SQL proxy for database initialization..." -ForegroundColor Green

# Check if Cloud SQL proxy is installed
if (-not (Get-Command "cloud_sql_proxy" -ErrorAction SilentlyContinue)) {
    Write-Host "   Cloud SQL proxy not found. Please download it from:" -ForegroundColor Red
    Write-Host "   https://cloud.google.com/sql/docs/postgres/sql-proxy#install" -ForegroundColor Red
    Write-Host "   Place it in this directory or add it to your PATH." -ForegroundColor Red
} else {
    # Get instance connection name
    $INSTANCE_CONNECTION_NAME = gcloud sql instances describe $INSTANCE_NAME --format="value(connectionName)"
    
    # Start Cloud SQL Proxy in the background
    Write-Host "   Starting Cloud SQL Proxy..." -ForegroundColor Yellow
    Start-Process -FilePath "cloud_sql_proxy" -ArgumentList "-instances=$INSTANCE_CONNECTION_NAME=tcp:5432 -credential_file=$KEY_FILE" -NoNewWindow
    
    # Wait for proxy to start
    Start-Sleep -Seconds 5
    
    # Install necessary tools for PostgreSQL if not available
    if (-not (Get-Command "psql" -ErrorAction SilentlyContinue)) {
        Write-Host "   PostgreSQL client tools not found. Please install PostgreSQL client tools." -ForegroundColor Red
        Write-Host "   https://www.postgresql.org/download/" -ForegroundColor Red
    } else {
        # Apply SQL scripts to each database
        Write-Host "6️⃣ Applying SQL scripts to databases..." -ForegroundColor Green
        
        # Auth Service Database
        Write-Host "   Initializing auth_service database..." -ForegroundColor Yellow
        $env:PGPASSWORD = $ROOT_PASSWORD
        psql -h localhost -p 5432 -U postgres -d auth_service -f "database/auth-service-data.sql"
        
        # Doctor Service Database
        Write-Host "   Initializing doctor_service database..." -ForegroundColor Yellow
        psql -h localhost -p 5432 -U postgres -d doctor_service -f "database/doctor-service-data.sql"
        
        # Patient Service Database
        Write-Host "   Initializing patient_service database..." -ForegroundColor Yellow
        psql -h localhost -p 5432 -U postgres -d patient_service -f "database/patient-service-data.sql"
        
        # Appointment Service Database
        Write-Host "   Initializing appointment_service database..." -ForegroundColor Yellow
        psql -h localhost -p 5432 -U postgres -d appointment_service -f "database/appointment-service-data.sql"
        
        # Medical Records Service Database
        Write-Host "   Initializing medical_records_service database..." -ForegroundColor Yellow
        psql -h localhost -p 5432 -U postgres -d medical_records_service -f "database/medical-records-service-data.sql"
        
        # Stop Cloud SQL Proxy
        Stop-Process -Name "cloud_sql_proxy" -ErrorAction SilentlyContinue
    }
}

# Update Kubernetes secrets with database connection information
Write-Host "7️⃣ Updating Kubernetes secrets with database connection information..." -ForegroundColor Green

$DB_HOST = gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)"

foreach ($DB in $DBS) {
    $SERVICE_NAME = $DB.Replace("_", "-")
    Write-Host "   Updating secret for $SERVICE_NAME..." -ForegroundColor Yellow
    
    kubectl create secret generic "$SERVICE_NAME-db-credentials" `
        --namespace healthcare-system `
        --from-literal=username="postgres" `
        --from-literal=password=$ROOT_PASSWORD `
        --from-literal=host=$DB_HOST `
        --from-literal=port="5432" `
        --from-literal=database=$DB `
        --dry-run=client -o yaml | kubectl apply -f -
}

Write-Host "✅ Cloud SQL database deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Restart your Kubernetes deployments to pick up the new secrets:" -ForegroundColor White
Write-Host "      kubectl rollout restart deployment -n healthcare-system" -ForegroundColor White
Write-Host "   2. Check database connection status in your application logs:" -ForegroundColor White
Write-Host "      kubectl logs -n healthcare-system deployment/auth-service" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important Security Notes:" -ForegroundColor Yellow
Write-Host "   - The root password is hardcoded in this script. In production, use a secure secret management solution." -ForegroundColor White
Write-Host "   - The service account key file ($KEY_FILE) contains sensitive information. Keep it secure and do not commit it to version control." -ForegroundColor White 