import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Button, 
  Divider, 
  Chip,
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Appointment } from '../../store/slices/appointmentSlice';

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
  onViewAll: () => void;
  onViewAppointment: (appointmentId: number) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  appointments,
  onViewAll,
  onViewAppointment,
}) => {
  const formatAppointmentTime = (appointment: Appointment) => {
    const startTime = format(new Date(`2000-01-01T${appointment.startTime}`), 'h:mm a');
    const endTime = format(new Date(`2000-01-01T${appointment.endTime}`), 'h:mm a');
    return `${startTime} - ${endTime}`;
  };
  
  const formatAppointmentDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM dd, yyyy');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardHeader
        title="Upcoming Appointments"
        action={
          <Button 
            endIcon={<ChevronRightIcon />}
            onClick={onViewAll}
          >
            View All
          </Button>
        }
      />
      <CardContent>
        {appointments.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {appointments.slice(0, 5).map((appointment, index) => (
              <React.Fragment key={appointment.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => onViewAppointment(appointment.id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#bbdefb' }}>
                      <CalendarIcon color="primary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          Dr. {appointment.doctorId}
                        </Typography>
                        <Chip 
                          label={appointment.status} 
                          color={getStatusColor(appointment.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block' }}
                        >
                          {formatAppointmentDate(appointment.date)}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {formatAppointmentTime(appointment)}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block', textTransform: 'capitalize' }}
                        >
                          {appointment.type} - {appointment.reason ? appointment.reason.substring(0, 30) : 'No reason provided'}
                          {appointment.reason && appointment.reason.length > 30 ? '...' : ''}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No upcoming appointments
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard; 