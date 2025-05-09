import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  Person as PatientIcon,
  Timeline as StatsIcon,
  NotificationsActive as AlertIcon,
  MedicalServices as MedicalRecordIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import { RootState, AppDispatch } from '../../store';
import { fetchUpcomingAppointments } from '../../store/slices/appointmentSlice';
import StatCard from '../../components/Dashboard/StatCard';
import UpcomingAppointmentsCard from '../../components/Dashboard/UpcomingAppointmentsCard';
import RecentActivityCard from '../../components/Dashboard/RecentActivityCard';
import PatientStatistics from '../../components/Dashboard/PatientStatistics';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { upcomingAppointments, loading: appointmentsLoading } = useSelector((state: RootState) => state.appointment);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user) {
          // Load appointments based on user role
          if (user.role === 'doctor') {
            // Load doctor's upcoming appointments
            await dispatch(fetchUpcomingAppointments(user.id)).unwrap();
          } else if (user.role === 'admin') {
            // For admin, load all appointments
            await dispatch(fetchUpcomingAppointments(0)).unwrap();
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [dispatch, user]);
  
  if (isLoading || appointmentsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Stats for dashboard (in a real app, these would come from API)
  const stats = {
    totalAppointments: upcomingAppointments.length,
    totalPatients: 184,
    completedAppointments: 26,
    cancelledAppointments: 5,
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.firstName}. Here's what's happening today.
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Appointments Today"
            value={stats.totalAppointments.toString()}
            icon={<CalendarIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Patients"
            value={stats.totalPatients.toString()}
            icon={<PatientIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Completed Appointments"
            value={stats.completedAppointments.toString()}
            icon={<StatsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Cancelled Appointments"
            value={stats.cancelledAppointments.toString()}
            icon={<AlertIcon />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <UpcomingAppointmentsCard 
            appointments={upcomingAppointments}
            onViewAll={() => navigate('/appointments')}
            onViewAppointment={(id) => navigate(`/appointments/${id}`)}
          />
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <RecentActivityCard />
        </Grid>
        
        {/* Patient Statistics (for doctors/admin) */}
        {(user?.role === 'doctor' || user?.role === 'admin') && (
          <Grid item xs={12}>
            <PatientStatistics />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage; 