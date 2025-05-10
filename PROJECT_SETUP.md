# Healthcare Appointment System - Project Setup Guide

## 1. Project Structure
```
healthcare-appointment-system/
├── frontend/                 # React frontend application
├── services/                 # Backend microservices
│   ├── appointment-service/  # Appointment management
│   ├── auth-service/        # Authentication service
│   └── notification-service/ # Notification service
├── infrastructure/          # Infrastructure as Code
│   ├── terraform/           # Terraform configurations
│   └── kubernetes/          # Kubernetes manifests
├── ci-cd/                   # CI/CD pipeline configurations
├── monitoring/              # Monitoring and logging setup
└── docs/                    # Project documentation
```

## 2. Database Design

### 2.1 Schema Design
```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records Table
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_id INTEGER REFERENCES appointments(id),
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Cloud Database Setup (AWS RDS)
1. Create RDS instance:
```bash
# Using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier healthcare-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password <secure-password> \
    --allocated-storage 20
```

2. Configure security groups and VPC settings
3. Enable encryption at rest
4. Set up automated backups

## 3. Backend Setup

### 3.1 Environment Variables
Create `.env` files for each service:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-secure-secret
JWT_EXPIRATION=24h

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

### 3.2 Service Dependencies
```json
{
  "dependencies": {
    "express": "^4.17.1",
    "pg": "^8.7.1",
    "redis": "^4.0.0",
    "jsonwebtoken": "^8.5.1",
    "bcrypt": "^5.0.1",
    "cors": "^2.8.5",
    "helmet": "^4.6.0",
    "winston": "^3.3.3"
  }
}
```

## 4. Frontend Setup

### 4.1 Environment Variables
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
```

### 4.2 Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0",
    "axios": "^0.27.2",
    "@mui/material": "^5.10.0",
    "@reduxjs/toolkit": "^1.8.5"
  }
}
```

## 5. CI/CD Pipeline (GitHub Actions)

### 5.1 Pipeline Structure
```yaml
name: Healthcare App CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: |
          npm install
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker Images
        run: |
          docker build -t frontend ./frontend
          docker build -t backend ./services

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: |
          # Add deployment steps
```

## 6. Monitoring Setup

### 6.1 Prometheus Configuration
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3000']

  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:80']
```

### 6.2 Grafana Dashboards
- System metrics
- Application metrics
- Business metrics

## 7. Security Implementation

### 7.1 Authentication Flow
1. User login
2. JWT token generation
3. Token validation
4. Role-based access control

### 7.2 Data Encryption
- TLS for data in transit
- AES-256 for data at rest
- Secure password hashing

## 8. Performance Optimization

### 8.1 Caching Strategy
- Redis for session management
- CDN for static assets
- Database query optimization

### 8.2 Load Testing
```bash
# Using k6
k6 run load-test.js
```

## 9. Deployment Steps

1. Set up cloud infrastructure:
```bash
# Using Terraform
terraform init
terraform plan
terraform apply
```

2. Deploy database:
```bash
# Run migrations
npm run migrate
```

3. Deploy services:
```bash
# Using Docker Compose
docker-compose up -d
```

4. Verify deployment:
```bash
# Check service health
curl http://localhost:3000/health
```

## 10. Maintenance and Monitoring

1. Regular backups:
```bash
# Database backup
pg_dump -U postgres healthcare > backup.sql
```

2. Log monitoring:
```bash
# View logs
docker-compose logs -f
```

3. Performance monitoring:
- Use Grafana dashboards
- Set up alerts
- Monitor resource usage

## 11. Scaling Considerations

1. Horizontal scaling:
- Use Kubernetes for container orchestration
- Implement load balancing
- Use auto-scaling groups

2. Database scaling:
- Read replicas
- Connection pooling
- Query optimization

## 12. Cost Optimization

1. Resource optimization:
- Use appropriate instance sizes
- Implement auto-scaling
- Use spot instances where possible

2. Storage optimization:
- Implement data lifecycle policies
- Use appropriate storage classes
- Regular cleanup of unused resources 