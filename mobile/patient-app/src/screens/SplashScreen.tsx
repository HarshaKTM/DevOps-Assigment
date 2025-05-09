import React from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';

const SplashScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Healthcare Appointment System
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
        Your health, our priority
      </Text>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen; 