import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { Visibility, Edit, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';
import { Appointment } from '../../store/slices/appointmentSlice';

interface AppointmentListProps {
  appointments: Appointment[];
  onViewAppointment: (appointmentId: number) => void;
  onEditAppointment?: (appointmentId: number) => void;
  onCancelAppointment?: (appointmentId: number) => void;
  showActions?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onViewAppointment,
  onEditAppointment,
  onCancelAppointment,
  showActions = true,
}) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (appointments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          No appointments found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table aria-label="appointments table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            {showActions && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} hover>
              <TableCell>{formatDate(appointment.date)}</TableCell>
              <TableCell>
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {appointment.type.replace('-', ' ')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                  {appointment.reason}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={appointment.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(appointment.status),
                    color: '#fff',
                    textTransform: 'capitalize',
                  }}
                />
              </TableCell>
              {showActions && (
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onViewAppointment(appointment.id)}
                    aria-label="view appointment"
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  {onEditAppointment && appointment.status === 'scheduled' && (
                    <IconButton
                      size="small"
                      onClick={() => onEditAppointment(appointment.id)}
                      aria-label="edit appointment"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                  {onCancelAppointment && appointment.status === 'scheduled' && (
                    <IconButton
                      size="small"
                      onClick={() => onCancelAppointment(appointment.id)}
                      aria-label="cancel appointment"
                      color="error"
                    >
                      <Cancel fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentList; 