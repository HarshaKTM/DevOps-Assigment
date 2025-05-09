import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalHospital as LocalHospitalIcon } from '@mui/icons-material';

const AuthLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {/* Left side branding */}
      <Box
        sx={{
          flex: isMobile ? 'none' : 1,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          minHeight: isMobile ? '200px' : 'auto',
        }}
      >
        <LocalHospitalIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Healthcare Appointment System
        </Typography>
        <Typography variant="body1" align="center">
          Manage your healthcare appointments with ease and efficiency
        </Typography>
      </Box>

      {/* Right side auth forms */}
      <Box
        sx={{
          flex: isMobile ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Outlet />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout; 