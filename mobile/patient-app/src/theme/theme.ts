import { DefaultTheme } from 'react-native-paper';
import { Platform } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Define colors
const primaryColor = '#1976d2';
const secondaryColor = '#4caf50';
const errorColor = '#f44336';

// Light theme
export const lightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: primaryColor,
    secondary: secondaryColor,
    error: errorColor,
    background: '#f5f5f5',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#212121',
    border: '#e0e0e0',
    notification: primaryColor,
    onSurface: '#212121',
    surfaceVariant: '#f0f0f0',
    onSurfaceVariant: '#595959',
    outline: '#bdbdbd',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '400',
    },
    medium: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '500',
    },
    light: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '300',
    },
    thin: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '100',
    },
  },
  roundness: 8,
};

// Dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64b5f6',
    secondary: '#81c784',
    error: '#e57373',
    background: '#121212',
    surface: '#1e1e1e',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#424242',
    notification: '#64b5f6',
    onSurface: '#ffffff',
    surfaceVariant: '#303030',
    onSurfaceVariant: '#b0b0b0',
    outline: '#5c5c5c',
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    regular: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '400',
    },
    medium: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '500',
    },
    light: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '300',
    },
    thin: {
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      fontWeight: '100',
    },
  },
  roundness: 8,
};

// Component specific themes
export const componentThemes = {
  Button: {
    raised: true,
    mode: 'contained',
    contentStyle: {
      paddingVertical: 6,
    },
  },
  Card: {
    elevation: 2,
    style: {
      marginVertical: 8,
      borderRadius: 8,
    },
  },
  TextInput: {
    mode: 'outlined',
    style: {
      marginVertical: 8,
    },
  },
  FAB: {
    color: '#ffffff',
    style: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  },
  Appbar: {
    elevation: 4,
  },
};

// Navigation theme
export const navigationTheme = {
  light: {
    dark: false,
    colors: {
      primary: primaryColor,
      background: lightTheme.colors.background,
      card: lightTheme.colors.surface,
      text: lightTheme.colors.text,
      border: lightTheme.colors.border,
      notification: primaryColor,
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: darkTheme.colors.primary,
      background: darkTheme.colors.background,
      card: darkTheme.colors.surface,
      text: darkTheme.colors.text,
      border: darkTheme.colors.border,
      notification: darkTheme.colors.primary,
    },
  },
};

export default {
  light: lightTheme,
  dark: darkTheme,
  components: componentThemes,
  navigation: navigationTheme,
}; 