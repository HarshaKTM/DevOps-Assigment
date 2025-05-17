# Master Deployment Script for Healthcare System
Write-Host "🚀 Starting Complete Healthcare System Deployment to Google Cloud" -ForegroundColor Cyan

# Check if PowerShell is running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️ WARNING: This script may need administrator privileges for some operations." -ForegroundColor Yellow
    Write-Host "   Consider running PowerShell as Administrator if you encounter permission issues." -ForegroundColor Yellow
    Write-Host ""
}

# Check if gcloud is installed
if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Google Cloud SDK (gcloud) is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if docker is installed
if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if kubectl is installed
if (-not (Get-Command "kubectl" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"

# Login to Google Cloud
Write-Host "1️⃣ Authenticating with Google Cloud..." -ForegroundColor Green
gcloud auth login

# Set project
Write-Host "2️⃣ Setting project to $PROJECT_ID..." -ForegroundColor Green
gcloud config set project $PROJECT_ID

# Install gke-gcloud-auth-plugin if not installed
Write-Host "3️⃣ Installing GKE auth plugin if not present..." -ForegroundColor Green
try {
    gcloud components install gke-gcloud-auth-plugin
} catch {
    Write-Host "⚠️ Could not install gke-gcloud-auth-plugin. You may need to run PowerShell as Administrator." -ForegroundColor Yellow
    Write-Host "   Continuing anyway, but kubectl commands may fail..." -ForegroundColor Yellow
}

# Execute Docker image build and push script
Write-Host "4️⃣ Building and pushing Docker images to Google Container Registry..." -ForegroundColor Green
. .\push-docker-images.ps1

# Execute Kubernetes deployment update script
Write-Host "5️⃣ Updating Kubernetes deployments with the new images..." -ForegroundColor Green
. .\update-k8s-deployments.ps1

# Final summary
Write-Host "✅ Deployment process completed!" -ForegroundColor Green
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "   - Docker images built and pushed to Google Container Registry" -ForegroundColor White
Write-Host "   - Kubernetes deployments updated with new images" -ForegroundColor White
Write-Host "   - Services deployed to GKE cluster: healthcare-system-dev" -ForegroundColor White

# Instructions for accessing the application
Write-Host "📌 To access the application:" -ForegroundColor Cyan
Write-Host "   1. Get the external IP of the Ingress (may take a few minutes to provision):" -ForegroundColor White
Write-Host "      kubectl get ingress -n healthcare-system" -ForegroundColor White
Write-Host "   2. Access the application at http://<EXTERNAL-IP>" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To monitor deployment status:" -ForegroundColor Cyan
Write-Host "   kubectl get pods -n healthcare-system" -ForegroundColor White 