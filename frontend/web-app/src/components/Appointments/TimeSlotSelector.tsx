import React from 'react';
import { Grid, Button, Typography, Paper } from '@mui/material';
import { TimeSlot } from '../../services/appointmentService';
import { format } from 'date-fns';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
}) => {
  // Helper function to format the time (e.g., "09:00" to "9:00 AM")
  const formatTime = (time: string) => {
    const hour = parseInt(time.split(':')[0], 10);
    const minutes = time.split(':')[1];
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  // Sort time slots by time
  const sortedTimeSlots = [...timeSlots].sort((a, b) => {
    const hourA = parseInt(a.startTime.split(':')[0], 10);
    const minutesA = parseInt(a.startTime.split(':')[1], 10);
    const hourB = parseInt(b.startTime.split(':')[0], 10);
    const minutesB = parseInt(b.startTime.split(':')[1], 10);
    return hourA * 60 + minutesA - (hourB * 60 + minutesB);
  });

  // Group time slots by morning, afternoon, and evening
  const morningSlots = sortedTimeSlots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(':')[0], 10);
    return hour >= 8 && hour < 12;
  });

  const afternoonSlots = sortedTimeSlots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = sortedTimeSlots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(':')[0], 10);
    return hour >= 17 && hour <= 20;
  });

  return (
    <Paper elevation={0} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select a Time
      </Typography>

      {morningSlots.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Morning
          </Typography>
          <Grid container spacing={1}>
            {morningSlots.map((slot) => (
              <Grid item key={slot.startTime}>
                <Button
                  variant={selectedTimeSlot?.startTime === slot.startTime ? 'contained' : 'outlined'}
                  color={selectedTimeSlot?.startTime === slot.startTime ? 'primary' : 'inherit'}
                  disabled={!slot.available}
                  size="small"
                  onClick={() => onSelectTimeSlot(slot)}
                  sx={{ 
                    minWidth: '80px',
                    opacity: slot.available ? 1 : 0.5
                  }}
                >
                  {formatTime(slot.startTime)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {afternoonSlots.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Afternoon
          </Typography>
          <Grid container spacing={1}>
            {afternoonSlots.map((slot) => (
              <Grid item key={slot.startTime}>
                <Button
                  variant={selectedTimeSlot?.startTime === slot.startTime ? 'contained' : 'outlined'}
                  color={selectedTimeSlot?.startTime === slot.startTime ? 'primary' : 'inherit'}
                  disabled={!slot.available}
                  size="small"
                  onClick={() => onSelectTimeSlot(slot)}
                  sx={{ 
                    minWidth: '80px',
                    opacity: slot.available ? 1 : 0.5
                  }}
                >
                  {formatTime(slot.startTime)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {eveningSlots.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Evening
          </Typography>
          <Grid container spacing={1}>
            {eveningSlots.map((slot) => (
              <Grid item key={slot.startTime}>
                <Button
                  variant={selectedTimeSlot?.startTime === slot.startTime ? 'contained' : 'outlined'}
                  color={selectedTimeSlot?.startTime === slot.startTime ? 'primary' : 'inherit'}
                  disabled={!slot.available}
                  size="small"
                  onClick={() => onSelectTimeSlot(slot)}
                  sx={{ 
                    minWidth: '80px',
                    opacity: slot.available ? 1 : 0.5
                  }}
                >
                  {formatTime(slot.startTime)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedTimeSlot && (
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
          Selected time: {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
        </Typography>
      )}
    </Paper>
  );
};

export default TimeSlotSelector; 