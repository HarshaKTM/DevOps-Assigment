import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Title, 
  HelperText, 
  useTheme, 
  ActivityIndicator, 
  Checkbox,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { login, selectIsLoading, selectError } from '../store/slices/authSlice';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Validate email
  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('Invalid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Validate password
  const validatePassword = (text: string) => {
    if (!text) {
      setPasswordError('Password is required');
      return false;
    } else if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      dispatch(login({ email, password }));
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.title}>Healthcare App</Title>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.formContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => validateEmail(email)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            error={!!emailError}
            disabled={isLoading}
          />
          {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
            mode="outlined"
            secureTextEntry={secureTextEntry}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={secureTextEntry ? "eye" : "eye-off"} 
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            style={styles.input}
            error={!!passwordError}
            disabled={isLoading}
          />
          {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={isLoading}
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
              <Text style={[styles.registerText, { color: theme.colors.primary }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo credentials */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Account:</Text>
          <Text style={styles.demoText}>Email: patient@example.com</Text>
          <Text style={styles.demoText}>Password: password</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  rememberText: {
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    marginRight: 8,
  },
  registerText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#666',
  },
});

export default LoginScreen; 