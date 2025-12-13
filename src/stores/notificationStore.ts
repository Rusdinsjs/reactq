// Notification Store - Manage in-app notifications

import { create } from 'zustand';
import type { Notification } from '../types/global.types';
import { createNotification } from '../services/notificationService';

interface NotificationState {
    // Current notifications
    notifications: Notification[];

    // Actions
    addNotification: (notification: Notification) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;

    // Convenience methods
    showInfo: (title: string, message: string, duration?: number) => void;
    showSuccess: (title: string, message: string, duration?: number) => void;
    showWarning: (title: string, message: string, duration?: number) => void;
    showError: (title: string, message: string, duration?: number) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],

    // Add notification
    addNotification: (notification) => {
        set((state) => ({
            notifications: [...state.notifications, notification],
        }));

        // Auto-remove non-persistent notifications
        if (!notification.persistent && notification.duration) {
            setTimeout(() => {
                get().removeNotification(notification.id);
            }, notification.duration);
        }
    },

    // Remove notification
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    // Clear all notifications
    clearAll: () => {
        set({ notifications: [] });
    },

    // Convenience methods
    showInfo: (title, message, duration = 5000) => {
        const notification = createNotification('info', title, message, { duration });
        get().addNotification(notification);
    },

    showSuccess: (title, message, duration = 3000) => {
        const notification = createNotification('success', title, message, { duration });
        get().addNotification(notification);
    },

    showWarning: (title, message, duration = 7000) => {
        const notification = createNotification('warning', title, message, { duration });
        get().addNotification(notification);
    },

    showError: (title, message, duration = 10000) => {
        const notification = createNotification('error', title, message, { duration });
        get().addNotification(notification);
    },
}));
