// Notification Service - System notifications

import type { Notification } from '../types/global.types';

let notificationIdCounter = 0;

/**
 * Create a new notification
 */
export function createNotification(
    type: Notification['type'],
    title: string,
    message: string,
    options: Partial<Pick<Notification, 'duration' | 'persistent'>> = {}
): Notification {
    return {
        id: `notification-${++notificationIdCounter}`,
        type,
        title,
        message,
        duration: options.duration ?? 5000,
        persistent: options.persistent ?? false,
        timestamp: new Date(),
    };
}

/**
 * Show browser notification (if permission granted)
 */
export async function showBrowserNotification(
    title: string,
    body: string,
    icon?: string
): Promise<boolean> {
    if (!('Notification' in window)) {
        return false;
    }

    if (Notification.permission === 'granted') {
        new Notification(title, { body, icon });
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification(title, { body, icon });
            return true;
        }
    }

    return false;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        return 'denied';
    }
    return await Notification.requestPermission();
}

/**
 * Check notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
}

/**
 * Create prayer time notification
 */
export function createPrayerNotification(
    prayerName: string,
    prayerNameArabic: string
): Notification {
    return createNotification(
        'info',
        `Waktu ${prayerName} telah tiba`,
        `${prayerNameArabic} - Saatnya menunaikan sholat ${prayerName}`,
        { duration: 0, persistent: true }
    );
}

/**
 * Create countdown notification
 */
export function createCountdownNotification(
    prayerName: string,
    minutesRemaining: number
): Notification {
    return createNotification(
        'info',
        `${minutesRemaining} menit menuju ${prayerName}`,
        `Persiapkan diri untuk sholat ${prayerName}`,
        { duration: 5000 }
    );
}

/**
 * Create error notification
 */
export function createErrorNotification(
    title: string,
    message: string
): Notification {
    return createNotification('error', title, message, { duration: 10000 });
}

/**
 * Create success notification
 */
export function createSuccessNotification(
    title: string,
    message: string
): Notification {
    return createNotification('success', title, message, { duration: 3000 });
}
