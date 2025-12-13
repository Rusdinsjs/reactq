// Prayer Alert Component

import { PRAYER_DISPLAY_NAMES, type PrayerName } from '../../types/prayer.types';
import './PrayerTimes.css';

interface PrayerAlertProps {
    prayer: PrayerName;
    onClose?: () => void;
}

export function PrayerAlert({ prayer, onClose }: PrayerAlertProps) {
    const displayNames = PRAYER_DISPLAY_NAMES[prayer];

    return (
        <div className="prayer-alert" onClick={onClose}>
            <div className="prayer-alert__content">
                <div className="prayer-alert__title">Waktu Sholat Telah Tiba</div>
                <div className="prayer-alert__prayer-name">{displayNames.id}</div>
                <div className="prayer-alert__arabic">{displayNames.ar}</div>
            </div>
        </div>
    );
}

export default PrayerAlert;
