import { create } from 'zustand';
import { Notification } from '../types';
import apiClient from '../services/apiClient';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await apiClient.get('/notifications');
      const notifications = response.data.data;
      const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      const updatedNotifications = get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
      set({ notifications: updatedNotifications, unreadCount });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.patch('/notifications/mark-all-read');
      const updatedNotifications = get().notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      set({ notifications: updatedNotifications, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    const updatedNotifications = [notification, ...get().notifications];
    const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
    set({ notifications: updatedNotifications, unreadCount });
  },
}));
