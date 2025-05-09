# Healthcare System Mobile App

A React Native mobile application for patients to manage their healthcare appointments, view medical records, and receive notifications. This app provides a seamless healthcare experience for patients on iOS and Android platforms.

## Features

- **Patient Authentication**
  - Secure login with email or social authentication
  - Biometric authentication support (Face ID, Touch ID, fingerprint)
  - Multi-factor authentication for added security
  - Password reset and account recovery options

- **Appointment Management**
  - View upcoming appointments
  - Book new appointments with preferred doctors
  - Reschedule or cancel appointments
  - Get real-time notifications for appointment reminders
  - Check in for appointments digitally

- **Doctor Search and Selection**
  - Browse doctors by specialty, location, or availability
  - View doctor profiles with specializations and qualifications
  - See real-time availability calendar
  - Read patient reviews and ratings
  - Add favorite doctors for quick access

- **Medical Records**
  - View medical history and past appointment summaries
  - Access lab results and diagnostic reports
  - View prescribed medications and treatment plans
  - Download and share medical records securely
  - Track health metrics over time

- **Payments and Insurance**
  - View and pay outstanding bills
  - Save payment methods securely
  - Manage insurance information
  - View coverage details and eligibility
  - Access payment history and receipts

- **Notifications**
  - Appointment reminders
  - Doctor schedule changes
  - Medical report availability alerts
  - Medication reminders
  - Health tips and recommendations

- **Telemedicine Integration**
  - Join video consultations directly in the app
  - Pre-appointment questionnaires
  - Post-appointment feedback
  - Secure messaging with healthcare providers

## Technology Stack

- **Frontend Framework**: React Native
- **State Management**: Redux with Redux Toolkit
- **UI Components**: React Native Paper
- **Navigation**: React Navigation
- **API Communication**: Axios
- **Authentication**: Firebase Authentication
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics
- **Testing**: Jest and React Native Testing Library
- **Build & Deployment**: Fastlane

## Getting Started

### Prerequisites

- Node.js 16+ installed
- React Native development environment set up
- iOS: XCode and CocoaPods (Mac only)
- Android: Android Studio and Android SDK

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd frontend/mobile-app
npm install
```

3. Install iOS pods (Mac only):

```bash
cd ios && pod install && cd ..
```

4. Create a `.env` file with the required environment variables:

```
API_BASE_URL=https://api.healthcare-system.example.com
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
```

5. Start the development server:

```bash
npm start
```

6. Run on iOS simulator (Mac only):

```bash
npm run ios
```

7. Run on Android emulator or device:

```bash
npm run android
```

### Building for Production

#### iOS

```bash
cd ios
fastlane beta
```

#### Android

```bash
cd android
fastlane beta
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