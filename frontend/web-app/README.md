# Healthcare System Web Dashboard

Administrative interface for healthcare staff and doctors to manage appointments and view analytics.

## Features

### Schedule Management
- View doctor's daily, weekly, and monthly schedules
- Block/unblock time slots for appointments
- Set recurring availability patterns
- Manage personal time off

### Patient Appointment Overview
- View all upcoming and past appointments
- Filter appointments by status, date range, or doctor
- View patient details and medical history
- Add notes to appointments
- Check in patients for appointments
- Mark appointments as completed

### Analytics Dashboard
- View appointments per day/week/month
- Monitor cancellation rates and no-show statistics
- Track doctor utilization and popular time slots
- Generate reports on appointment trends

## Technology Stack
- React with TypeScript
- Material UI for interface components
- Redux for state management
- Chart.js for analytics visualizations
- JWT authentication for secure access

## Role-Based Access
- **Doctors**: View own schedule and appointments, manage availability
- **Nurses**: Check in patients, view doctor schedules, manage appointments
- **Administrators**: Full access to all dashboard features and reports

## Getting Started

### Installation
```
npm install
```

### Running the Dashboard
```
npm start
```

### Testing
```
npm test
```

## Project Structure

```
src/
├── assets/            # Static assets (images, fonts, etc.)
├── components/        # Reusable UI components
│   ├── common/        # Application-wide components
│   ├── appointments/  # Appointment-related components
│   ├── patients/      # Patient-related components
│   ├── doctors/       # Doctor-related components
│   └── analytics/     # Analytics and reporting components
├── hooks/             # Custom React hooks
├── pages/             # Top-level page components
├── services/          # API services and external integrations
├── store/             # Redux store configuration
│   ├── slices/        # Redux slices for different features
│   └── selectors/     # Reusable selectors
├── utils/             # Utility functions and helpers
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Authentication and Authorization

The dashboard uses JWT-based authentication with the backend services. Role-based access control is enforced both on the client and server sides.

### User Roles

- **Administrator**: Full access to all system features
- **Doctor**: Access to own schedule, assigned patients, and medical records
- **Staff**: Basic appointment management and patient information

## Theming and Customization

The dashboard supports customizable theming to match your healthcare organization's brand:

1. Edit the theme configuration in `src/theme/index.ts`
2. Replace logo and brand assets in the `src/assets` directory
3. Customize colors, typography, and component styles through the theme

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode during development
npm test -- --watch
```

### Test Structure

- Unit tests for utility functions and hooks
- Component tests for UI behavior
- Integration tests for feature workflows
- Mock API responses for predictable testing

## Deployment

The dashboard can be deployed to any static hosting service:

### Google Cloud Storage

```bash
# Build the application
npm run build

# Deploy to GCS bucket
gcloud storage cp -r dist/* gs://your-healthcare-dashboard-bucket/
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy to Firebase
firebase deploy
```

## Monitoring and Analytics

The dashboard includes built-in monitoring:

- Error tracking with Sentry
- Usage analytics with Google Analytics
- Performance monitoring with Web Vitals

## Accessibility

This dashboard is built with accessibility in mind:

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Responsive design for all devices

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 