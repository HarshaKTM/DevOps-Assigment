#!/usr/bin/env pwsh

# Initialize Healthcare System Databases
Write-Host "🚀 Initializing Healthcare System Databases" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$SQL_INSTANCE = "eastern-period-459411-i8"
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

# Create service account for Cloud SQL
$SQL_SA_NAME = "healthcare-sql-client"
$SQL_KEY_FILE = "healthcare-sql-client-key.json"

Write-Host "2️⃣ Setting up Cloud SQL service account..." -ForegroundColor Green

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
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SQL_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" --role="roles/cloudsql.editor"

# Create databases if they don't exist
Write-Host "3️⃣ Checking if databases exist..." -ForegroundColor Green
foreach ($DB in $DBS) {
    $DB_EXISTS = gcloud sql databases list --instance=$SQL_INSTANCE --filter="name:$DB" --format="value(name)" 2>$null
    if (-not $DB_EXISTS) {
        Write-Host "   Creating database $DB..." -ForegroundColor Yellow
        gcloud sql databases create $DB --instance=$SQL_INSTANCE
    } else {
        Write-Host "   Database $DB already exists." -ForegroundColor Yellow
    }
}

# Download and setup Cloud SQL Proxy
Write-Host "4️⃣ Setting up Cloud SQL Proxy..." -ForegroundColor Green

# Check if Cloud SQL Proxy is installed
if (-not (Get-Command "cloud_sql_proxy" -ErrorAction SilentlyContinue)) {
    Write-Host "   Cloud SQL Proxy not found. Downloading..." -ForegroundColor Yellow
    
    # Determine platform-specific download URL
    $os = "windows"
    $arch = "amd64"
    $downloadUrl = "https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.$os.$arch.exe"
    
    # Download Cloud SQL Proxy
    Invoke-WebRequest -Uri $downloadUrl -OutFile "cloud_sql_proxy.exe"
    Write-Host "   Cloud SQL Proxy downloaded." -ForegroundColor Green
}

# Start Cloud SQL Proxy
Write-Host "5️⃣ Starting Cloud SQL Proxy..." -ForegroundColor Green
$proxyProcess = Start-Process -FilePath "cloud_sql_proxy.exe" -ArgumentList "--credentials-file=$SQL_KEY_FILE --address=127.0.0.1 --port=5432 $SQL_INSTANCE_CONNECTION" -PassThru

# Wait a bit for proxy to start
Start-Sleep -Seconds 5

try {
    # Check if PostgreSQL client is installed
    if (-not (Get-Command "psql" -ErrorAction SilentlyContinue)) {
        Write-Host "   PostgreSQL client not found. Please install PostgreSQL client tools." -ForegroundColor Red
        Write-Host "   Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Red
        exit 1
    }

    # Apply database schemas and insert sample data
    Write-Host "6️⃣ Initializing databases with sample data..." -ForegroundColor Green
    $env:PGPASSWORD = $ROOT_PASSWORD

    # Auth Service Database
    Write-Host "   Initializing auth_service database..." -ForegroundColor Yellow
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

    Write-Host "✅ Database initialization completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error initializing databases: $_" -ForegroundColor Red
}
finally {
    # Stop the Cloud SQL Proxy
    if ($proxyProcess) {
        Write-Host "   Stopping Cloud SQL Proxy..." -ForegroundColor Yellow
        Stop-Process -Id $proxyProcess.Id -Force
    }
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Verify database connections from your services:" -ForegroundColor White
Write-Host "      kubectl logs -n healthcare-system deployment/auth-service" -ForegroundColor White
Write-Host "   2. Make API requests to your services to verify data access" -ForegroundColor White
Write-Host "   3. Check Cloud SQL logs in GCP Console: https://console.cloud.google.com/logs/query" -ForegroundColor White 