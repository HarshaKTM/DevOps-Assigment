# Healthcare System Migration Tools

This directory contains tools and scripts for migrating data from legacy healthcare systems to the new microservices-based Healthcare Appointment System. The migration process is designed to be reliable, secure, and to maintain data integrity throughout the transition.

## Overview

The migration process follows these high-level steps:

1. Extract data from the legacy system
2. Transform the data to match the new system's schema and data models
3. Load the data into the new system's databases
4. Verify data integrity and completeness
5. Switch over to the new system

## Prerequisites

- Access credentials to the legacy database system
- Proper permissions in the target GCP environment
- Node.js 16+ installed
- Google Cloud SDK installed and configured
- Network connectivity to both source and target databases

## Configuration

Before running the migration, you need to configure the connection settings in the `.env` file:

```
# Legacy Database Configuration
LEGACY_DB_HOST=your-legacy-db-host
LEGACY_DB_PORT=3306
LEGACY_DB_USER=your-legacy-db-user
LEGACY_DB_PASSWORD=your-legacy-db-password
LEGACY_DB_NAME=your-legacy-db-name
LEGACY_DB_TYPE=mysql

# Target Database Configuration
TARGET_DB_HOST=your-gcp-sql-host
TARGET_DB_PORT=5432
TARGET_DB_USER=migration-user
TARGET_DB_PASSWORD=your-secure-password
TARGET_DB_NAME=patient_service
TARGET_DB_TYPE=postgres

# Google Cloud Storage Configuration
GCS_BUCKET=healthcare-medical-records-bucket
GCS_PATH=migrated-files/

# Migration Settings
BATCH_SIZE=500
LOG_LEVEL=info
```

## Migration Scripts

The following scripts are available for different migration tasks:

### 1. Data Assessment

```bash
node scripts/assess-data.js
```

This script analyzes the source data to identify:
- Total record counts
- Data quality issues
- Potential schema mapping challenges
- Estimated migration time

### 2. Schema Migration

```bash
node scripts/migrate-schema.js
```

This script creates the necessary schema in the target databases. It should be run before data migration.

### 3. Data Migration

#### Patient Data

```bash
node scripts/migrate-patients.js
```

Migrates patient demographic data, accounts, and authentication information.

#### Appointment History

```bash
node scripts/migrate-appointments.js
```

Migrates historical appointment data.

#### Medical Records

```bash
node scripts/migrate-medical-records.js
```

Migrates patient medical history, including:
- Medical records text data to the database
- Document files to Cloud Storage

#### Physician Data

```bash
node scripts/migrate-doctors.js
```

Migrates physician profile data, scheduling rules, and specialties.

### 4. Data Verification

```bash
node scripts/verify-migration.js
```

This script performs integrity checks on the migrated data, including:
- Record count comparisons
- Checksum verification for critical data
- Sample data validation
- Relationship integrity checks

## Incremental Sync

For minimal-downtime migration, you can set up an incremental sync:

```bash
node scripts/incremental-sync.js --continuous
```

This script monitors the legacy database for changes and replicates them to the new system in near real-time during the transition period.

## Rollback Procedure

In case of migration issues, a rollback can be initiated:

```bash
node scripts/rollback.js
```

This will restore the system to its pre-migration state.

## Security Considerations

- All scripts use secure connections to databases
- Passwords and credentials are never logged
- All data in transit is encrypted
- PII data is handled according to HIPAA guidelines
- Access to migration tools is restricted and audited

## Monitoring Migration Progress

Progress metrics are exposed in several ways:

- Console output with real-time statistics
- Log files in the `logs/` directory
- Prometheus metrics endpoint on port 9090 during migration
- Status dashboard available at `http://localhost:3000` during migration

## Troubleshooting

Common issues and their solutions:

### Connection Failures

Check network connectivity and credentials:

```bash
node scripts/test-connection.js --source
node scripts/test-connection.js --target
```

### Data Mapping Errors

Run the mapping diagnostic tool:

```bash
node scripts/diagnose-mapping.js
```

### Performance Issues

Adjust the batch size in the configuration:

```bash
node scripts/optimize-performance.js
``` 