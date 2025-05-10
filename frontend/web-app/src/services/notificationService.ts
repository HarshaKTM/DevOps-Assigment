import { api } from './api';
import { AxiosResponse } from 'axios';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system' | 'message';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

class NotificationService {
  /**
   * Get all notifications for a user
   */
  async getNotifications(userId: number): Promise<Notification[]> {
    try {
      const response: AxiosResponse<Notification[]> = await api.get(`/api/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const response: AxiosResponse<{ count: number }> = await api.get(`/api/notifications/user/${userId}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const response: AxiosResponse<Notification> = await api.patch(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number): Promise<{ success: boolean }> {
    try {
      const response: AxiosResponse<{ success: boolean }> = await api.patch(`/api/notifications/user/${userId}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<{ success: boolean }> {
    try {
      const response: AxiosResponse<{ success: boolean }> = await api.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time notifications using WebSocket
   * @param userId - The user ID to subscribe for
   * @param callback - Function to call when a new notification is received
   * @returns A function to unsubscribe when done
   */
  subscribeToNotifications(userId: number, callback: (notification: Notification) => void): () => void {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'localhost:4000';
    const wsUrl = `${wsProtocol}://${baseUrl.replace(/^https?:\/\//, '')}/api/notifications/ws`;
    
    // Get auth token
    const token = localStorage.getItem('token');
    
    // Create WebSocket connection
    const socket = new WebSocket(`${wsUrl}?userId=${userId}&token=${token}`);
    
    // Handle incoming messages
    socket.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification;
        callback(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };
    
    // Handle connection errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Return unsubscribe function
    return () => {
      socket.close();
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService; 