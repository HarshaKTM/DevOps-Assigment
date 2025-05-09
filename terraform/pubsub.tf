# Pub/Sub topics for event-driven communication
resource "google_pubsub_topic" "appointment_created" {
  name = "appointment-created-${var.environment}"
  
  message_retention_duration = "86600s" # 24 hours
  
  kms_key_name = google_kms_crypto_key.db_encryption_key.id
  
  # Labels for monitoring
  labels = {
    environment = var.environment
    service     = "appointment"
    event_type  = "created"
  }
}

resource "google_pubsub_topic" "appointment_updated" {
  name = "appointment-updated-${var.environment}"
  
  message_retention_duration = "86600s" # 24 hours
  
  kms_key_name = google_kms_crypto_key.db_encryption_key.id
  
  # Labels for monitoring
  labels = {
    environment = var.environment
    service     = "appointment"
    event_type  = "updated"
  }
}

resource "google_pubsub_topic" "appointment_canceled" {
  name = "appointment-canceled-${var.environment}"
  
  message_retention_duration = "86600s" # 24 hours
  
  kms_key_name = google_kms_crypto_key.db_encryption_key.id
  
  # Labels for monitoring
  labels = {
    environment = var.environment
    service     = "appointment"
    event_type  = "canceled"
  }
}

resource "google_pubsub_topic" "notification_requested" {
  name = "notification-requested-${var.environment}"
  
  message_retention_duration = "86600s" # 24 hours
  
  kms_key_name = google_kms_crypto_key.db_encryption_key.id
  
  # Labels for monitoring
  labels = {
    environment = var.environment
    service     = "notification"
    event_type  = "requested"
  }
}

# Pub/Sub subscriptions for services
resource "google_pubsub_subscription" "notification_appointment_created" {
  name  = "notification-appointment-created-${var.environment}"
  topic = google_pubsub_topic.appointment_created.name
  
  # Acknowledge deadline in seconds
  ack_deadline_seconds = 20
  
  # Expiration policy
  expiration_policy {
    ttl = ""  # Never expire
  }
  
  # Retry policy
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"  # 10 minutes
  }
  
  # Enable message ordering
  enable_message_ordering = true
  
  # Dead letter policy
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.notification_dlq.name
    max_delivery_attempts = 5
  }
}

resource "google_pubsub_subscription" "notification_appointment_updated" {
  name  = "notification-appointment-updated-${var.environment}"
  topic = google_pubsub_topic.appointment_updated.name
  
  # Acknowledge deadline in seconds
  ack_deadline_seconds = 20
  
  # Expiration policy
  expiration_policy {
    ttl = ""  # Never expire
  }
  
  # Retry policy
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"  # 10 minutes
  }
  
  # Enable message ordering
  enable_message_ordering = true
  
  # Dead letter policy
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.notification_dlq.name
    max_delivery_attempts = 5
  }
}

resource "google_pubsub_subscription" "notification_appointment_canceled" {
  name  = "notification-appointment-canceled-${var.environment}"
  topic = google_pubsub_topic.appointment_canceled.name
  
  # Acknowledge deadline in seconds
  ack_deadline_seconds = 20
  
  # Expiration policy
  expiration_policy {
    ttl = ""  # Never expire
  }
  
  # Retry policy
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"  # 10 minutes
  }
  
  # Enable message ordering
  enable_message_ordering = true
  
  # Dead letter policy
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.notification_dlq.name
    max_delivery_attempts = 5
  }
}

# Dead Letter Queue Topic
resource "google_pubsub_topic" "notification_dlq" {
  name = "notification-dlq-${var.environment}"
  
  message_retention_duration = "604800s" # 7 days
  
  kms_key_name = google_kms_crypto_key.db_encryption_key.id
  
  # Labels for monitoring
  labels = {
    environment = var.environment
    service     = "notification"
    event_type  = "dlq"
  }
}

# Service account for Pub/Sub
resource "google_service_account" "pubsub_publisher" {
  account_id   = "pubsub-publisher-${var.environment}"
  display_name = "PubSub Publisher Service Account"
}

resource "google_pubsub_topic_iam_binding" "publisher_binding" {
  for_each = toset([
    google_pubsub_topic.appointment_created.name,
    google_pubsub_topic.appointment_updated.name,
    google_pubsub_topic.appointment_canceled.name,
    google_pubsub_topic.notification_requested.name,
  ])
  
  topic   = each.key
  role    = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${google_service_account.pubsub_publisher.email}",
  ]
}

resource "google_service_account" "pubsub_subscriber" {
  account_id   = "pubsub-subscriber-${var.environment}"
  display_name = "PubSub Subscriber Service Account"
}

resource "google_pubsub_subscription_iam_binding" "subscriber_binding" {
  for_each = toset([
    google_pubsub_subscription.notification_appointment_created.name,
    google_pubsub_subscription.notification_appointment_updated.name,
    google_pubsub_subscription.notification_appointment_canceled.name,
  ])
  
  subscription = each.key
  role         = "roles/pubsub.subscriber"
  members      = [
    "serviceAccount:${google_service_account.pubsub_subscriber.email}",
  ]
} 