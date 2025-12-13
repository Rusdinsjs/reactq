// Prayer Notification Component
import { useNotificationStore } from '../../stores/notificationStore';
import './Common.css';

export function PrayerNotification() {
    const { notifications, removeNotification } = useNotificationStore();

    if (notifications.length === 0) return null;

    return (
        <div className="prayer-notifications">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`prayer-notification prayer-notification--${notification.type}`}
                    onClick={() => removeNotification(notification.id)}
                >
                    <div className="prayer-notification__title">{notification.title}</div>
                    <div className="prayer-notification__message">{notification.message}</div>
                </div>
            ))}
        </div>
    );
}

export default PrayerNotification;
