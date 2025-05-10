# Healthcare Appointment System

A modern, scalable healthcare appointment management system built with Node.js, TypeScript, and PostgreSQL.

## Features

- User authentication and authorization (Patients, Doctors, Admin)
- Appointment scheduling and management
- Patient records management
- Doctor profiles and availability
- Real-time notifications
- RESTful API architecture
- Secure data handling
- Scalable microservices architecture

## Tech Stack

### Backend
- Node.js with TypeScript
- Express.js for API routing
- PostgreSQL for database
- JWT for authentication
- Winston for logging
- Jest for testing

### Infrastructure
- Docker for containerization
- AWS for cloud hosting
- Terraform for infrastructure as code
- GitHub Actions for CI/CD

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker and Docker Compose
- AWS CLI (for deployment)
- Terraform (for infrastructure)

## Project Structure

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

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/healthcare-appointment-system.git
cd healthcare-appointment-system
```

2. Install dependencies:
```bash
cd services/appointment-service
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start PostgreSQL database:
```bash
docker-compose up -d db
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t healthcare-appointment-service .
```

2. Run the container:
```bash
docker run -p 3000:3000 healthcare-appointment-service
```

### AWS Deployment

1. Configure AWS credentials:
```bash
aws configure
```

2. Initialize Terraform:
```bash
cd infrastructure/terraform
terraform init
```

3. Deploy infrastructure:
```bash
terraform plan
terraform apply
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Appointment Endpoints

- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Patient Endpoints

- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctor Endpoints

- `GET /api/doctors` - List doctors
- `POST /api/doctors` - Create doctor
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

## Security

- JWT-based authentication
- Role-based access control
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Data encryption

## Monitoring

- Application logs with Winston
- Error tracking
- Performance monitoring
- Health checks
- Metrics collection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@healthcare-app.com or create an issue in the repository. 