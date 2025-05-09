import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { login, selectIsAuthenticated, selectIsLoading, selectError, clearErrors } from '../store/slices/authSlice';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    return () => {
      // Clear errors when unmounting
      dispatch(clearErrors());
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password should be of minimum 6 characters length')
      .required('Password is required'),
  });

  // Form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          disabled={isLoading}
        />
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Demo credentials */}
      <Box sx={{ mt: 4, width: '100%' }}>
        <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
          Demo Accounts:
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Patient: patient@example.com / password<br />
          Doctor: doctor@example.com / password<br />
          Admin: admin@example.com / password
        </Typography>
      </Box>
    </Box>
  );
};

export default Login; 