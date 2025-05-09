export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedEntityId?: number;
  relatedEntityType?: 'appointment' | 'medical_record' | 'message';
  createdAt: string;
}

export type NotificationType = 
  | 'appointment_reminder' 
  | 'appointment_update'
  | 'appointment_cancelled'
  | 'lab_results'
  | 'prescription'
  | 'message'
  | 'payment'
  | 'system';

export interface NotificationPreferences {
  userId: number;
  email: boolean;
  push: boolean;
  sms: boolean;
  notificationTypes: {
    appointment_reminder: boolean;
    appointment_update: boolean;
    appointment_cancelled: boolean;
    lab_results: boolean;
    prescription: boolean;
    message: boolean;
    payment: boolean;
    system: boolean;
  };
} 