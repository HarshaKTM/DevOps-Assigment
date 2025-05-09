# Healthcare System Web Dashboard

This is the administrative web dashboard for the Healthcare Appointment System. It provides healthcare staff and doctors with tools to manage appointments, view patient information, and access analytics.

## Features

- **Authentication and Authorization**
  - Role-based access control (Admin, Doctor, Staff)
  - Secure login with MFA option
  - Password reset and account management

- **Appointment Management**
  - View and manage all upcoming appointments
  - Schedule, reschedule, and cancel appointments
  - Batch operations for multiple appointments
  - Conflict detection and resolution

- **Patient Management**
  - Search and view patient profiles
  - View patient medical history
  - Add notes and update patient information
  - Track patient appointment history

- **Doctor Schedule Management**
  - Set availability and working hours
  - Block time slots for meetings or breaks
  - View daily, weekly and monthly schedule
  - Set recurring availability patterns

- **Analytics Dashboard**
  - Appointment statistics (daily, weekly, monthly)
  - Cancellation rates and reasons
  - Provider utilization metrics
  - Patient demographics and trends

- **System Administration**
  - User management for staff accounts
  - Department and service configuration
  - System settings and preferences
  - Audit logs and activity monitoring

## Technology Stack

- **Frontend Framework**: React.js with TypeScript
- **State Management**: Redux with Redux Toolkit
- **UI Components**: Material-UI (MUI)
- **Form Handling**: Formik with Yup validation
- **Charts and Visualizations**: Recharts
- **API Communication**: Axios with React Query
- **Testing**: Jest and React Testing Library
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Access to the Healthcare System API endpoints

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd frontend/web-dashboard
npm install
```

3. Create a `.env.local` file with the required environment variables:

```
VITE_API_BASE_URL=https://api.healthcare-system.example.com
VITE_AUTH_DOMAIN=your-auth-domain.com
VITE_AUTH_CLIENT_ID=your-client-id
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The optimized production build will be available in the `dist` directory.

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