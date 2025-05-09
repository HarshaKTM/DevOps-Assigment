# Healthcare Patient Mobile App

Patient-facing mobile application for booking and managing healthcare appointments.

## Features

### Appointment Booking & Management
- Book new appointments with preferred doctors
- View calendar of available time slots
- Cancel or reschedule existing appointments
- Get directions to appointment location

### Appointment Viewing
- See all upcoming appointments with details
- View appointment history
- Get reminders for upcoming appointments
- Filter appointments by doctor, specialty, or date

### Profile Management
- Update personal information
- Manage contact preferences
- Upload/update insurance information
- Set communication preferences

### Notifications
- Receive push notifications for appointment reminders
- Get alerts for scheduling changes
- Receive confirmation messages for bookings/cancellations
- Option to enable/disable different notification types

## Technology Stack
- React Native for cross-platform mobile development
- Redux for state management
- Axios for API communication
- React Navigation for screen navigation
- Async Storage for local data persistence

## Getting Started

### Requirements
- Node.js 16+
- React Native CLI or Expo
- iOS/Android development environment

### Installation
```
npm install
```

### Running the App
```
# For iOS
npm run ios

# For Android
npm run android
```

### Testing
```
npm test
```

## Project Structure

```
src/
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable UI components
│   ├── common/         # Application-wide components
│   ├── appointments/   # Appointment-related components
│   ├── doctors/        # Doctor-related components
│   ├── medical/        # Medical records components
│   └── profile/        # User profile components
├── hooks/              # Custom React hooks
├── navigation/         # React Navigation setup
├── screens/            # Screen components
├── services/           # API services and external integrations
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices for different features
│   └── selectors/      # Reusable selectors
├── utils/              # Utility functions and helpers
├── theme/              # Theming and styling utilities
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Authentication Flow

The app uses Firebase Authentication with JWT tokens for API authentication:

1. User logs in with email/password or social authentication
2. Firebase returns authentication tokens
3. These tokens are exchanged for API tokens with the backend
4. API tokens are stored securely in the device keychain
5. Tokens are refreshed automatically when expired

## Offline Support

The app includes offline support for critical features:

- Cached appointment information
- Offline appointment booking (synced when online)
- Downloaded medical records available offline
- Local storage of user preferences and settings

## Push Notifications

Firebase Cloud Messaging is used for push notifications:

- Deep linking to relevant screens from notifications
- Background and foreground notification handling
- Notification preferences management
- Scheduled local notifications for medication reminders

## Security Features

- Biometric authentication for app access
- Secure storage for sensitive information
- Automatic session timeout
- Certificate pinning for API communication
- Detection of rooted/jailbroken devices
- Data encryption for local storage

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
- E2E tests for critical user journeys

## Deployment

The app is deployed to app stores using Fastlane:

- Automated version bumping
- Screenshot generation
- TestFlight/Play Store beta distribution
- App Store/Play Store submission

## Monitoring and Analytics

The app includes monitoring tools:

- Crash reporting with Firebase Crashlytics
- Usage analytics with Firebase Analytics
- Performance monitoring with Firebase Performance
- Custom events tracking for business metrics

## Accessibility

The app is designed with accessibility in mind:

- Screen reader support (VoiceOver/TalkBack)
- Dynamic font size support
- High contrast mode
- Keyboard navigation support on tablets
- RTL language support

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 