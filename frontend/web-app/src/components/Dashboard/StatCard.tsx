import React, { ReactNode } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
} from '@mui/material';

export interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  subtitle?: string;
  comparison?: {
    type: 'increase' | 'decrease';
    value: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  subtitle,
  comparison 
}) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 40, height: 40, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
        {comparison && (
          <Typography 
            variant="body2" 
            color={comparison.type === 'increase' ? 'success.main' : 'error.main'}
            sx={{ mt: 1 }}
          >
            {comparison.type === 'increase' ? '↑' : '↓'} {comparison.value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard; 