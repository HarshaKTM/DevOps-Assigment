import React from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { format } from 'date-fns';
import { TimeSlot } from '../../services/appointmentService';

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
  // Group time slots into morning, afternoon, and evening
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    return hour >= 8 && hour < 12;
  });
  
  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });
  
  const eveningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    return hour >= 17 && hour <= 20;
  });
  
  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };
  
  const renderTimeSlots = (slots: TimeSlot[], title: string) => {
    if (slots.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Grid container spacing={1}>
          {slots.map((slot) => (
            <Grid item key={slot.time}>
              <Button
                variant={selectedTimeSlot?.time === slot.time ? 'contained' : 'outlined'}
                color={selectedTimeSlot?.time === slot.time ? 'primary' : 'inherit'}
                onClick={() => onSelectTimeSlot(slot)}
                disabled={!slot.isAvailable}
                sx={{ 
                  minWidth: '80px',
                  opacity: slot.isAvailable ? 1 : 0.5 
                }}
              >
                {formatTime(slot.time)}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  return (
    <Box>
      {renderTimeSlots(morningSlots, 'Morning')}
      {renderTimeSlots(afternoonSlots, 'Afternoon')}
      {renderTimeSlots(eveningSlots, 'Evening')}
    </Box>
  );
};

export default TimeSlotSelector; 