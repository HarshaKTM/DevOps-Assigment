import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationApi } from '../../services/notificationService';
import { Notification } from '../../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll',
  async (userId: number, { rejectWithValue }) => {
    try {
      const notifications = await notificationApi.getNotifications(userId);
      return notifications;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (userId: number, { rejectWithValue }) => {
    try {
      const count = await notificationApi.getUnreadCount(userId);
      return count;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const updatedNotification = await notificationApi.markAsRead(notificationId);
      return updatedNotification;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (userId: number, { rejectWithValue }) => {
    try {
      const result = await notificationApi.markAllAsRead(userId);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(notification => !notification.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Unread Count
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark as Read
    builder
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
        state.loading = false;
        
        // Update the notification in the list
        state.notifications = state.notifications.map(notification => 
          notification.id === action.payload.id ? action.payload : notification
        );
        
        // Update unread count
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark All as Read
    builder
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        
        // Mark all notifications as read
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        
        // Reset unread count
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Notification
    builder
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        
        // Remove the notification from the list
        const deletedNotification = state.notifications.find(n => n.id === action.payload);
        state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        
        // Update unread count if the deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = notificationSlice.actions;

export default notificationSlice.reducer; 