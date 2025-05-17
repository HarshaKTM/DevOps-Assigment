# Push Docker Images to Google Container Registry
Write-Host "🚀 Starting Docker image build and push to Google Container Registry" -ForegroundColor Cyan

# Set variables
$PROJECT_ID = "eastern-period-459411-i8"
$REGION = "asia-south1"
$SERVICES = @("appointment-service", "patient-service", "doctor-service", "notification-service", "medical-records-service", "auth-service")
$GCR_HOSTNAME = "gcr.io"

# Configure Docker to use Google Cloud credentials
Write-Host "1️⃣ Configuring Docker authentication with Google Cloud..." -ForegroundColor Green
gcloud auth configure-docker $GCR_HOSTNAME --quiet

# Create Artifact Registry repository if it doesn't exist
Write-Host "2️⃣ Creating Artifact Registry repository if needed..." -ForegroundColor Green
$REPO_NAME = "healthcare-services"
gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION --description="Healthcare microservices repository" --quiet

# Build and push all service Docker images
Write-Host "3️⃣ Building and pushing Docker images for all services..." -ForegroundColor Green

foreach ($SERVICE in $SERVICES) {
    # Check if service directory exists
    if (Test-Path "services/$SERVICE") {
        Write-Host "   Processing $SERVICE..." -ForegroundColor Yellow
        Push-Location "services/$SERVICE"
        
        # Check if Dockerfile exists
        if (Test-Path "Dockerfile") {
            # Build the Docker image with a valid tag
            Write-Host "   Building $SERVICE image..." -ForegroundColor Yellow
            $IMAGE_TAG = "$GCR_HOSTNAME/$PROJECT_ID/$SERVICE`:latest"
            docker build -t $IMAGE_TAG .
            
            # Push the Docker image to Google Container Registry
            Write-Host "   Pushing $SERVICE image to GCR..." -ForegroundColor Yellow
            docker push $IMAGE_TAG
        } else {
            Write-Host "   ⚠️ Dockerfile not found for $SERVICE, creating simple Dockerfile..." -ForegroundColor Yellow
            @"
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
"@ | Out-File -FilePath "Dockerfile" -Encoding ASCII
            
            # Build with the new Dockerfile
            Write-Host "   Building $SERVICE with generated Dockerfile..." -ForegroundColor Yellow
            $IMAGE_TAG = "$GCR_HOSTNAME/$PROJECT_ID/$SERVICE`:latest"
            docker build -t $IMAGE_TAG .
            
            # Push the Docker image to Google Container Registry
            Write-Host "   Pushing $SERVICE image to GCR..." -ForegroundColor Yellow
            docker push $IMAGE_TAG
        }
        
        Pop-Location
    } else {
        Write-Host "   ⚠️ Directory for $SERVICE not found, skipping..." -ForegroundColor Red
    }
}

# Build and push frontend
Write-Host "4️⃣ Building and pushing frontend image..." -ForegroundColor Green
if (Test-Path "frontend/web-app") {
    Push-Location "frontend/web-app"
    
    if (Test-Path "Dockerfile") {
        # Create a simpler Dockerfile for the frontend that works reliably
        Write-Host "   Creating reliable Dockerfile for frontend..." -ForegroundColor Yellow
        @"
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"@ | Out-File -FilePath "Dockerfile.new" -Encoding ASCII
        
        # Build the Docker image
        Write-Host "   Building frontend image..." -ForegroundColor Yellow
        $FRONTEND_TAG = "$GCR_HOSTNAME/$PROJECT_ID/frontend:latest"
        docker build -t $FRONTEND_TAG -f Dockerfile.new .
        
        # Push the Docker image to Google Container Registry
        Write-Host "   Pushing frontend image to GCR..." -ForegroundColor Yellow
        docker push $FRONTEND_TAG
    } else {
        Write-Host "   ⚠️ Dockerfile not found for frontend, creating one..." -ForegroundColor Yellow
        
        # Create nginx.conf if it doesn't exist
        if (-not (Test-Path "nginx.conf")) {
            @"
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://appointment-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
"@ | Out-File -FilePath "nginx.conf" -Encoding ASCII
        }
        
        @"
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"@ | Out-File -FilePath "Dockerfile" -Encoding ASCII
        
        # Build with the new Dockerfile
        Write-Host "   Building frontend with generated Dockerfile..." -ForegroundColor Yellow
        $FRONTEND_TAG = "$GCR_HOSTNAME/$PROJECT_ID/frontend:latest"
        docker build -t $FRONTEND_TAG .
        
        # Push the Docker image to Google Container Registry
        Write-Host "   Pushing frontend image to GCR..." -ForegroundColor Yellow
        docker push $FRONTEND_TAG
    }
    
    Pop-Location
} else {
    Write-Host "   ⚠️ Frontend directory not found, skipping..." -ForegroundColor Red
}

# List images in Artifact Registry
Write-Host "5️⃣ Listing images in Google Artifact Registry..." -ForegroundColor Green
gcloud artifacts docker images list --repository=$REPO_NAME --location=$REGION

Write-Host "✅ Docker images build and push completed!" -ForegroundColor Green 