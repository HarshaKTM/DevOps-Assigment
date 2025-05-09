resource "google_sql_database_instance" "main" {
  name             = "healthcare-db-${var.environment}"
  database_version = "POSTGRES_13"
  region           = var.region
  
  settings {
    tier = var.db_tier
    
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    
    backup_configuration {
      enabled            = true
      start_time         = "02:00"
      point_in_time_recovery_enabled = var.environment == "prod" ? true : false
    }
    
    maintenance_window {
      day  = 7  # Sunday
      hour = 2  # 2 AM
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }
    
    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }
    
    encryption_key_name = google_kms_crypto_key.db_encryption_key.id
  }
  
  deletion_protection = var.environment == "prod" ? true : false
  depends_on = [
    google_service_networking_connection.private_vpc_connection
  ]
}

# Create database for each service
resource "google_sql_database" "patient_service_db" {
  name     = "patient_service"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_database" "appointment_service_db" {
  name     = "appointment_service"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_database" "doctor_service_db" {
  name     = "doctor_service"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_database" "medical_records_db" {
  name     = "medical_records"
  instance = google_sql_database_instance.main.name
}

# Users for each service
resource "google_sql_user" "patient_service_user" {
  name     = "patient_service_user"
  instance = google_sql_database_instance.main.name
  password = random_password.patient_service_password.result
}

resource "google_sql_user" "appointment_service_user" {
  name     = "appointment_service_user"
  instance = google_sql_database_instance.main.name
  password = random_password.appointment_service_password.result
}

resource "google_sql_user" "doctor_service_user" {
  name     = "doctor_service_user"
  instance = google_sql_database_instance.main.name
  password = random_password.doctor_service_password.result
}

resource "google_sql_user" "medical_records_user" {
  name     = "medical_records_user"
  instance = google_sql_database_instance.main.name
  password = random_password.medical_records_password.result
}

# Generate random passwords
resource "random_password" "patient_service_password" {
  length  = 16
  special = true
}

resource "random_password" "appointment_service_password" {
  length  = 16
  special = true
}

resource "random_password" "doctor_service_password" {
  length  = 16
  special = true
}

resource "random_password" "medical_records_password" {
  length  = 16
  special = true
}

# Store passwords in Secret Manager
resource "google_secret_manager_secret" "patient_service_db_password" {
  secret_id = "patient-service-db-password-${var.environment}"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "patient_service_db_password" {
  secret      = google_secret_manager_secret.patient_service_db_password.id
  secret_data = random_password.patient_service_password.result
}

resource "google_secret_manager_secret" "appointment_service_db_password" {
  secret_id = "appointment-service-db-password-${var.environment}"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "appointment_service_db_password" {
  secret      = google_secret_manager_secret.appointment_service_db_password.id
  secret_data = random_password.appointment_service_password.result
}

resource "google_secret_manager_secret" "doctor_service_db_password" {
  secret_id = "doctor-service-db-password-${var.environment}"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "doctor_service_db_password" {
  secret      = google_secret_manager_secret.doctor_service_db_password.id
  secret_data = random_password.doctor_service_password.result
}

resource "google_secret_manager_secret" "medical_records_db_password" {
  secret_id = "medical-records-db-password-${var.environment}"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "medical_records_db_password" {
  secret      = google_secret_manager_secret.medical_records_db_password.id
  secret_data = random_password.medical_records_password.result
}

# Private IP for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "healthcare-db-private-ip-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# Redis for caching
resource "google_redis_instance" "cache" {
  name           = "healthcare-redis-${var.environment}"
  tier           = "STANDARD_HA"
  memory_size_gb = 1
  
  region                  = var.region
  authorized_network      = google_compute_network.vpc.id
  connect_mode            = "PRIVATE_SERVICE_ACCESS"
  
  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 2
        minutes = 0
      }
    }
  }
  
  redis_version = "REDIS_6_X"
  display_name  = "Healthcare System Redis Cache"
} 