provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required Google APIs
resource "google_project_service" "services" {
  for_each = toset([
    "container.googleapis.com",      # GKE
    "sqladmin.googleapis.com",       # Cloud SQL
    "redis.googleapis.com",          # Memorystore
    "artifactregistry.googleapis.com", # Container Registry
    "cloudbuild.googleapis.com",     # Cloud Build
    "cloudkms.googleapis.com",       # KMS for encryption
    "monitoring.googleapis.com",     # Cloud Monitoring
    "logging.googleapis.com",        # Cloud Logging
    "cloudfunctions.googleapis.com", # Cloud Functions
    "pubsub.googleapis.com",         # Pub/Sub
    "firestore.googleapis.com",      # Firestore
    "run.googleapis.com",            # Cloud Run
    "secretmanager.googleapis.com",  # Secret Manager
  ])

  project = var.project_id
  service = each.key

  disable_dependent_services = false
  disable_on_destroy         = false
} 