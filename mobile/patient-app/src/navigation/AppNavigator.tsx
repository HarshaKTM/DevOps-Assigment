import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserIcon, 
  BellIcon 
} from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';
import AppointmentDetailsScreen from '../screens/appointments/AppointmentDetailsScreen';
import BookAppointmentScreen from '../screens/appointments/BookAppointmentScreen';
import DoctorsScreen from '../screens/doctors/DoctorsScreen';
import DoctorDetailsScreen from '../screens/doctors/DoctorDetailsScreen';
import MedicalRecordsScreen from '../screens/medical-records/MedicalRecordsScreen';
import MedicalRecordDetailsScreen from '../screens/medical-records/MedicalRecordDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SelectDoctorScreen from '../screens/appointments/SelectDoctorScreen';
import SelectTimeScreen from '../screens/appointments/SelectTimeScreen';
import AppointmentConfirmationScreen from '../screens/appointments/AppointmentConfirmationScreen';
import NotificationPreferencesScreen from '../screens/profile/NotificationPreferencesScreen';

// Stack navigators
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const AppointmentStack = createStackNavigator();
const DoctorStack = createStackNavigator();
const MedicalRecordStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Tab navigator
const Tab = createBottomTabNavigator();

// Auth navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Home stack
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Dashboard' }}
    />
    <HomeStack.Screen 
      name="Notifications" 
      component={NotificationsScreen} 
    />
  </HomeStack.Navigator>
);

// Appointments stack
const AppointmentStackNavigator = () => (
  <AppointmentStack.Navigator>
    <AppointmentStack.Screen 
      name="Appointments" 
      component={AppointmentsScreen} 
      options={{ title: 'My Appointments' }}
    />
    <AppointmentStack.Screen 
      name="AppointmentDetails" 
      component={AppointmentDetailsScreen} 
      options={{ title: 'Appointment Details' }}
    />
    <AppointmentStack.Screen 
      name="BookAppointment" 
      component={BookAppointmentScreen} 
      options={{ title: 'Book Appointment' }}
    />
    <AppointmentStack.Screen 
      name="SelectDoctor" 
      component={SelectDoctorScreen} 
      options={{ title: 'Select Doctor' }}
    />
    <AppointmentStack.Screen 
      name="SelectTime" 
      component={SelectTimeScreen} 
      options={{ title: 'Select Time' }}
    />
    <AppointmentStack.Screen 
      name="AppointmentConfirmation" 
      component={AppointmentConfirmationScreen} 
      options={{ title: 'Appointment Confirmation' }}
    />
    <AppointmentStack.Screen 
      name="DoctorDetails" 
      component={DoctorDetailsScreen} 
      options={{ title: 'Doctor Details' }}
    />
  </AppointmentStack.Navigator>
);

// Doctors stack
const DoctorStackNavigator = () => (
  <DoctorStack.Navigator>
    <DoctorStack.Screen 
      name="Doctors" 
      component={DoctorsScreen} 
      options={{ title: 'Find Doctors' }}
    />
    <DoctorStack.Screen 
      name="DoctorDetails" 
      component={DoctorDetailsScreen} 
      options={{ title: 'Doctor Profile' }}
    />
    <DoctorStack.Screen 
      name="BookAppointment" 
      component={BookAppointmentScreen} 
      options={{ title: 'Book Appointment' }}
    />
  </DoctorStack.Navigator>
);

// Medical records stack
const MedicalRecordStackNavigator = () => (
  <MedicalRecordStack.Navigator>
    <MedicalRecordStack.Screen 
      name="MedicalRecords" 
      component={MedicalRecordsScreen} 
      options={{ title: 'Medical Records' }}
    />
    <MedicalRecordStack.Screen 
      name="MedicalRecordDetails" 
      component={MedicalRecordDetailsScreen} 
      options={{ title: 'Record Details' }}
    />
  </MedicalRecordStack.Navigator>
);

// Profile stack
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'My Profile' }}
    />
    <ProfileStack.Screen 
      name="EditProfile" 
      component={EditProfileScreen} 
      options={{ title: 'Edit Profile' }}
    />
    <ProfileStack.Screen 
      name="NotificationPreferences" 
      component={NotificationPreferencesScreen} 
      options={{ title: 'Notification Preferences' }}
    />
  </ProfileStack.Navigator>
);

// Notifications stack
const NotificationsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="My Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Main tab navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        switch (route.name) {
          case 'HomeTab':
            return <HomeIcon name="home" color={color} size={size} />;
          case 'AppointmentsTab':
            return <CalendarIcon name="calendar" color={color} size={size} />;
          case 'DoctorsTab':
            return <UserIcon name="account" color={color} size={size} />;
          case 'RecordsTab':
            return <HomeIcon name="home" color={color} size={size} />;
          case 'ProfileTab':
            return <UserIcon name="account" color={color} size={size} />;
          case 'Notifications':
            return <BellIcon name="bell" color={color} size={size} />;
          default:
            return null;
        }
      },
    })}
    tabBarOptions={{
      activeTintColor: '#1976d2',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeStackNavigator} 
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen 
      name="AppointmentsTab" 
      component={AppointmentStackNavigator} 
      options={{ tabBarLabel: 'Appointments' }}
    />
    <Tab.Screen 
      name="DoctorsTab" 
      component={DoctorStackNavigator} 
      options={{ tabBarLabel: 'Doctors' }}
    />
    <Tab.Screen 
      name="RecordsTab" 
      component={MedicalRecordStackNavigator} 
      options={{ tabBarLabel: 'Records' }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileStackNavigator} 
      options={{ tabBarLabel: 'Profile' }}
    />
    <Tab.Screen 
      name="Notifications" 
      component={NotificationsStackNavigator} 
      options={{ tabBarLabel: 'Notifications' }}
    />
  </Tab.Navigator>
);

// Root navigator
const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator; 