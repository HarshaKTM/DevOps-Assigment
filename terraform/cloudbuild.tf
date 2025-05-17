# Cloud Build IAM permissions for GKE access
resource "google_project_iam_member" "cloudbuild_kubernetes_developer" {
  project = var.project_id
  role    = "roles/container.developer"
  member  = "serviceAccount:${var.project_id}@cloudbuild.gserviceaccount.com"
}

# Cloud Build IAM permissions for artifact registry access
resource "google_project_iam_member" "cloudbuild_artifact_registry" {
  project = var.project_id
  role    = "roles/artifactregistry.admin"
  member  = "serviceAccount:${var.project_id}@cloudbuild.gserviceaccount.com"
}

# Cloud Build IAM permissions for secret access
resource "google_project_iam_member" "cloudbuild_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${var.project_id}@cloudbuild.gserviceaccount.com"
}

# Cloud Build IAM permissions for Compute access
resource "google_project_iam_member" "cloudbuild_compute_admin" {
  project = var.project_id
  role    = "roles/compute.admin"
  member  = "serviceAccount:${var.project_id}@cloudbuild.gserviceaccount.com"
}

# Cloud Build trigger for main branch
resource "google_cloudbuild_trigger" "main_branch_trigger" {
  name        = "healthcare-main-branch"
  description = "Build and deploy from main branch"
  
  github {
    owner = var.github_owner
    name  = var.github_repo
    
    push {
      branch = "^main$"
    }
  }
  
  filename = "ci-cd/cloudbuild.yaml"
  
  substitutions = {
    _DEPLOY_ENV        = "prod"
    _GKE_CLUSTER       = google_container_cluster.primary.name
    _GKE_ZONE          = var.region
    _DOMAIN            = var.domain_name
    _NOTIFY_SLACK      = "true"
    _SLACK_WEBHOOK_URL = var.slack_webhook_url
    _ENABLE_ROLLBACK   = "true"
  }
  
  depends_on = [
    google_project_service.services["cloudbuild.googleapis.com"]
  ]
}

# Cloud Build trigger for development branches
resource "google_cloudbuild_trigger" "dev_branch_trigger" {
  name        = "healthcare-dev-branch"
  description = "Build and deploy from development branches"
  
  github {
    owner = var.github_owner
    name  = var.github_repo
    
    push {
      branch = "^develop$"
    }
  }
  
  filename = "ci-cd/cloudbuild.yaml"
  
  substitutions = {
    _DEPLOY_ENV        = "dev"
    _GKE_CLUSTER       = google_container_cluster.primary.name
    _GKE_ZONE          = var.region
    _DOMAIN            = "dev.${var.domain_name}"
    _NOTIFY_SLACK      = "true"
    _SLACK_WEBHOOK_URL = var.slack_webhook_url
    _ENABLE_ROLLBACK   = "true"
  }
  
  depends_on = [
    google_project_service.services["cloudbuild.googleapis.com"]
  ]
}

# Cloud Build trigger for pull requests
resource "google_cloudbuild_trigger" "pr_trigger" {
  name        = "healthcare-pr-validation"
  description = "Validate pull requests"
  
  github {
    owner = var.github_owner
    name  = var.github_repo
    
    pull_request {
      branch = ".*"
      comment_control = "COMMENTS_ENABLED"
    }
  }
  
  filename = "ci-cd/pr-validation.yaml"
  
  depends_on = [
    google_project_service.services["cloudbuild.googleapis.com"]
  ]
}

# Secret for GitHub webhook
resource "google_secret_manager_secret" "github_webhook" {
  secret_id = "github-webhook"
  
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
  
  depends_on = [
    google_project_service.services["secretmanager.googleapis.com"]
  ]
}

# Add GitHub variables
variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "your-github-username"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "healthcare-appointment-system"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "healthcare-system.example.com"
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for notifications"
  type        = string
  default     = ""
  sensitive   = true
} 