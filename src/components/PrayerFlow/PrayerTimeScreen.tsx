// Prayer Time Screen - Shown when prayer time arrives (0.5 min)

import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import { PRAYER_DISPLAY_NAMES } from '../../types/prayer.types';
import './PrayerFlow.css';

interface PrayerTimeScreenProps {
    className?: string;
}

const PeciManIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.5 2 9.5 3 9.5 4.5V5H14.5V4.5C14.5 3 13.5 2 12 2Z" />
        <path d="M12 6C9.5 6 8 7.5 8 9.5V10.5C8 11.1 8.2 11.6 8.5 12C7.1 12.5 6 13.8 6 15.5V22H9V16H15V22H18V15.5C18 13.8 16.9 12.5 15.5 12C15.8 11.6 16 11.1 16 10.5V9.5C16 7.5 14.5 6 12 6Z" />
    </svg>
);

export function PrayerTimeScreen({ className = '' }: PrayerTimeScreenProps) {
    const { currentPrayer, getFormattedRemainingTime } = usePrayerFlow();

    if (!currentPrayer) return null;

    const names = PRAYER_DISPLAY_NAMES[currentPrayer];

    return (
        <div className={`prayer-flow-screen prayer-time-screen ${className}`}>
            <div className="prayer-flow-screen__content">
                <div className="prayer-time-screen__label">Waktu Sholat</div>

                <div className="prayer-time-screen__glass-card">
                    <div className="prayer-time-screen__prayer-name">{names.id}</div>

                    <div className="prayer-time-screen__icon-wrapper">
                        <PeciManIcon className="prayer-time-screen__icon" />
                    </div>

                    <div className="prayer-time-screen__status">Telah Tiba</div>
                </div>

                <div className="prayer-time-screen__countdown">
                    {getFormattedRemainingTime()}
                </div>
            </div>
        </div>
    );
}

export default PrayerTimeScreen;
