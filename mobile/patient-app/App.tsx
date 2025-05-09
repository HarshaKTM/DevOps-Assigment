import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar, useColorScheme } from 'react-native';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/theme/theme';
import { getCurrentUser } from './src/store/slices/authSlice';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  useEffect(() => {
    const initializeApp = async () => {
      // Dispatch action to check if user is already logged in
      await store.dispatch(getCurrentUser());
      
      // Simulate loading delay if needed
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={paperTheme.colors.background}
          />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
} 