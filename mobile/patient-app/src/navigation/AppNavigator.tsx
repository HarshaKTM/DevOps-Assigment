import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';

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
import NotificationsScreen from '../screens/NotificationsScreen';

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
  </ProfileStack.Navigator>
);

// Main tab navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'AppointmentsTab') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'DoctorsTab') {
          iconName = focused ? 'medical' : 'medical-outline';
        } else if (route.name === 'RecordsTab') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'ProfileTab') {
          iconName = focused ? 'person' : 'person-outline';
        }

        // You can return any component here
        return <Ionicons name={iconName as any} size={size} color={color} />;
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