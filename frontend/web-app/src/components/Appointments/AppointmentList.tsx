import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import { 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Appointment } from '../../services/appointmentService';

interface AppointmentListProps {
  appointments: Appointment[];
  onView: (appointmentId: number) => void;
  onEdit?: (appointmentId: number) => void;
  onCancel?: (appointmentId: number) => void;
  isUpcoming: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onView,
  onEdit,
  onCancel,
  isUpcoming,
}) => {
  const getStatusChipColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{formatDate(appointment.date)}</TableCell>
              <TableCell>
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </TableCell>
              <TableCell>Dr. {appointment.doctorId}</TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{appointment.type}</TableCell>
              <TableCell>
                <Chip 
                  label={appointment.status} 
                  color={getStatusChipColor(appointment.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View details">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onView(appointment.id)}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  {isUpcoming && appointment.status === 'scheduled' && onEdit && (
                    <Tooltip title="Edit appointment">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => onEdit(appointment.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {isUpcoming && appointment.status === 'scheduled' && onCancel && (
                    <Tooltip title="Cancel appointment">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onCancel(appointment.id)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentList; 