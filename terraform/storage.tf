# Cloud Storage for medical records
resource "google_storage_bucket" "medical_records" {
  name          = "healthcare-medical-records-${var.project_id}-${var.environment}"
  location      = var.region
  force_destroy = var.environment != "prod"
  
  versioning {
    enabled = true
  }
  
  encryption {
    default_kms_key_name = google_kms_crypto_key.storage_encryption_key.id
  }
  
  uniform_bucket_level_access = true
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
  
  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
}

# KMS for encryption
resource "google_kms_key_ring" "keyring" {
  name     = "healthcare-keyring-${var.environment}"
  location = var.region
}

resource "google_kms_crypto_key" "storage_encryption_key" {
  name     = "healthcare-storage-key-${var.environment}"
  key_ring = google_kms_key_ring.keyring.id
  
  rotation_period = "7776000s" # 90 days
  
  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key" "db_encryption_key" {
  name     = "healthcare-db-key-${var.environment}"
  key_ring = google_kms_key_ring.keyring.id
  
  rotation_period = "7776000s" # 90 days
  
  lifecycle {
    prevent_destroy = true
  }
}

# Service Account for accessing medical records
resource "google_service_account" "medical_records_service_account" {
  account_id   = "medical-records-sa-${var.environment}"
  display_name = "Medical Records Service Account"
}

resource "google_storage_bucket_iam_binding" "medical_records_access" {
  bucket = google_storage_bucket.medical_records.name
  role   = "roles/storage.objectAdmin"
  
  members = [
    "serviceAccount:${google_service_account.medical_records_service_account.email}",
  ]
}

# Artifact Registry for container images
resource "google_artifact_registry_repository" "healthcare_repo" {
  location      = var.region
  repository_id = "healthcare-repo-${var.environment}"
  format        = "DOCKER"
} 