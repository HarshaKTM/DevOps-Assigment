import React, { useEffect, useState } from 'react';
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
  Divider, 
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Message as MessageIcon,
  Assignment as AssignmentIcon,
  Note as NoteIcon,
  Medication as MedicationIcon,
  LocalHospital as HospitalIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Activity {
  id: number;
  type: 'message' | 'record' | 'note' | 'prescription' | 'appointment';
  title: string;
  description: string;
  timestamp: string;
}

const RecentActivityCard: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // This would typically be an API call to get recent activities
    // For now, we'll use mock data
    const mockActivities: Activity[] = [
      {
        id: 1,
        type: 'message',
        title: 'New message from Dr. Sarah Johnson',
        description: 'Follow-up about your last appointment',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
      },
      {
        id: 2,
        type: 'record',
        title: 'Medical record updated',
        description: 'Your blood test results have been added',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      },
      {
        id: 3,
        type: 'prescription',
        title: 'New prescription',
        description: 'Dr. Michael Lee prescribed Lisinopril',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      },
      {
        id: 4,
        type: 'appointment',
        title: 'Appointment rescheduled',
        description: 'Your appointment with Dr. Garcia has been moved',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        id: 5,
        type: 'note',
        title: 'Doctor\'s note added',
        description: 'Dr. Wilson added notes from your last visit',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      },
    ];
    
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, [user]);
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return <MessageIcon />;
      case 'record':
        return <AssignmentIcon />;
      case 'note':
        return <NoteIcon />;
      case 'prescription':
        return <MedicationIcon />;
      case 'appointment':
        return <HospitalIcon />;
      default:
        return <MessageIcon />;
    }
  };
  
  const getActivityIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return '#2196f3'; // blue
      case 'record':
        return '#4caf50'; // green
      case 'note':
        return '#ff9800'; // orange
      case 'prescription':
        return '#9c27b0'; // purple
      case 'appointment':
        return '#f44336'; // red
      default:
        return '#2196f3'; // blue
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardHeader
        title="Recent Activity"
        action={
          <Button 
            endIcon={<ChevronRightIcon />}
          >
            View All
          </Button>
        }
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getActivityIconColor(activity.type) }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block' }}
                        >
                          {activity.description}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {formatTimestamp(activity.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard; 