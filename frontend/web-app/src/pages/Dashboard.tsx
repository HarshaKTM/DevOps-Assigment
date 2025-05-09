import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  MedicalServices as MedicalServicesIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Services
import { fetchUpcomingAppointments } from '../services/appointmentService';

// Types
import { Appointment } from '../types/appointment';
import { selectUser } from '../store/slices/authSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const appointments = await fetchUpcomingAppointments();
        setUpcomingAppointments(appointments);
      } catch (error) {
        console.error('Failed to load upcoming appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
  };

  const handleViewAppointment = (id: number) => {
    navigate(`/appointments/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName || 'User'}!
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EventNoteIcon />}
                  onClick={handleBookAppointment}
                >
                  Book New Appointment
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AccessTimeIcon />}
                  onClick={handleViewAllAppointments}
                >
                  View All Appointments
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Upcoming Appointments</Typography>
                <Button
                  size="small"
                  onClick={handleViewAllAppointments}
                >
                  View All
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : upcomingAppointments.length > 0 ? (
                <List>
                  {upcomingAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem
                        button
                        onClick={() => handleViewAppointment(appointment.id)}
                        alignItems="flex-start"
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <MedicalServicesIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Dr. ${appointment.doctorName}`}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'block' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {format(new Date(appointment.startTime), 'PPP')} at {format(new Date(appointment.startTime), 'p')}
                              </Typography>
                              {appointment.type} appointment
                              {appointment.location && ` at ${appointment.location}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < upcomingAppointments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">No upcoming appointments</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleBookAppointment}
                  >
                    Book an Appointment
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Health Reminders/Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Medical Records Update"
                    secondary="Your latest lab results have been uploaded to your medical records."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Prescription Reminder"
                    secondary="Remember to refill your prescription for hypertension medication."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 