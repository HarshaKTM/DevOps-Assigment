# Build the Docker image
docker build -t appointment-service:latest .

# Create namespace if it doesn't exist
kubectl create namespace healthcare-system --dry-run=client -o yaml | kubectl apply -f -

# Apply ConfigMap
kubectl apply -f ../../kubernetes/appointment-service/configmap.yaml

# Replace placeholder variables in the deployment file and apply
$deploymentFile = Get-Content -Path "../../kubernetes/appointment-service/deployment.yaml"
$deploymentFile = $deploymentFile -replace '\${ARTIFACT_REGISTRY}', 'localhost'
$deploymentFile = $deploymentFile -replace '\${IMAGE_TAG}', 'latest'
$deploymentFile = $deploymentFile -replace '\${ENVIRONMENT}', 'dev'
$deploymentFile | Set-Content -Path "../../kubernetes/appointment-service/deployment.temp.yaml"

# Apply the deployment
kubectl apply -f "../../kubernetes/appointment-service/deployment.temp.yaml"

# Verify deployment
kubectl rollout status deployment/appointment-service -n healthcare-system

# Port-forward the service for local access
kubectl port-forward svc/appointment-service -n healthcare-system 8080:8080

# Clean up temp files
Remove-Item -Path "../../kubernetes/appointment-service/deployment.temp.yaml" 