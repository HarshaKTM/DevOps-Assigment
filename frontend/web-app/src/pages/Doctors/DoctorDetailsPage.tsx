import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person,
  School,
  Star,
  MedicalServices,
  CalendarMonth,
  ArrowBack,
} from '@mui/icons-material';
import { AppDispatch } from '../../store';
import {
  fetchDoctorById,
  selectSelectedDoctor,
  selectLoading,
  selectError,
} from '../../store/slices/doctorSlice';

const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const doctor = useSelector(selectSelectedDoctor);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(parseInt(id, 10)));
    }
  }, [dispatch, id]);
  
  const handleBookAppointment = () => {
    if (id) {
      navigate(`/appointments/book?doctorId=${id}`);
    }
  };
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!doctor) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Doctor not found
      </Alert>
    );
  }
  
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/doctors')}
          sx={{ mr: 2 }}
        >
          Back to Doctors
        </Button>
        <Typography variant="h5" component="h1">
          Doctor Profile
        </Typography>
      </Box>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={doctor.avatar}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Typography variant="h6" align="center">
              Dr. {doctor.firstName} {doctor.lastName}
            </Typography>
            <Chip
              icon={<MedicalServices />}
              label={doctor.specialization}
              color="primary"
              sx={{ mt: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Button>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                {doctor.about}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Star sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Experience:</strong> {doctor.yearsOfExperience} years
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                <School sx={{ mr: 1 }} /> Education & Qualifications
              </Typography>
              
              <List disablePadding>
                {doctor.education.map((edu, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <School fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${edu.degree} from ${edu.institution} (${edu.year})`} />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Qualifications
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {doctor.qualifications.map((qualification, index) => (
                  <Chip key={index} label={qualification} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Availability
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          To book an appointment with Dr. {doctor.lastName}, click the "Book Appointment" button
          and select your preferred date and time from the available slots.
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="outlined"
            startIcon={<CalendarMonth />}
            onClick={handleBookAppointment}
          >
            View Available Time Slots
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DoctorDetailsPage; 