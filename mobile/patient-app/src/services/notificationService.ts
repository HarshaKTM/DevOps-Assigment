import api from './api';
import { Notification } from '../types/notification';

// Development mode with mock data
const isDevEnvironment = true;

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 101,
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 9:30 AM.',
    type: 'appointment_reminder',
    isRead: false,
    relatedEntityId: 501,
    relatedEntityType: 'appointment',
    createdAt: '2023-07-09T14:00:00.000Z'
  },
  {
    id: 2,
    userId: 101,
    title: 'Prescription Refill',
    message: 'Your prescription for Lisinopril is ready for pickup at City Pharmacy.',
    type: 'prescription',
    isRead: true,
    relatedEntityId: 1004,
    relatedEntityType: 'medical_record',
    createdAt: '2023-06-20T16:30:00.000Z'
  },
  {
    id: 3,
    userId: 101,
    title: 'Lab Results Available',
    message: 'Your recent lab test results are now available. Please check your medical records.',
    type: 'lab_results',
    isRead: false,
    relatedEntityId: 1005,
    relatedEntityType: 'medical_record',
    createdAt: '2023-07-05T10:15:00.000Z'
  },
  {
    id: 4,
    userId: 101,
    title: 'Appointment Changed',
    message: 'Your appointment with Dr. Michael Chen has been rescheduled to July 26th at 2:30 PM.',
    type: 'appointment_update',
    isRead: false,
    relatedEntityId: 504,
    relatedEntityType: 'appointment',
    createdAt: '2023-07-01T09:45:00.000Z'
  }
];

class NotificationApiService {
  async getNotifications(userId: number): Promise<Notification[]> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockNotifications.filter(notification => notification.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    const response = await api.get(`/api/notifications/user/${userId}`);
    return response.data.data;
  }

  async getUnreadCount(userId: number): Promise<number> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockNotifications.filter(
        notification => notification.userId === userId && !notification.isRead
      ).length;
    }
    
    const response = await api.get(`/api/notifications/user/${userId}/unread-count`);
    return response.data.data.count;
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
      if (notificationIndex === -1) {
        throw new Error('Notification not found');
      }
      
      mockNotifications[notificationIndex].isRead = true;
      return mockNotifications[notificationIndex];
    }
    
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data.data;
  }

  async markAllAsRead(userId: number): Promise<{ success: boolean; count: number }> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let count = 0;
      mockNotifications.forEach(notification => {
        if (notification.userId === userId && !notification.isRead) {
          notification.isRead = true;
          count++;
        }
      });
      
      return { success: true, count };
    }
    
    const response = await api.put(`/api/notifications/user/${userId}/read-all`);
    return response.data.data;
  }

  async deleteNotification(notificationId: number): Promise<{ success: boolean }> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
      if (notificationIndex === -1) {
        throw new Error('Notification not found');
      }
      
      mockNotifications.splice(notificationIndex, 1);
      return { success: true };
    }
    
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  }
}

export const notificationApi = new NotificationApiService(); 