// Prayer Status Card Component

import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { formatTimeShort } from '../../utils/formatters';
import './PrayerTimes.css';

interface PrayerStatusCardProps {
    className?: string;
}

export function PrayerStatusCard({ className = '' }: PrayerStatusCardProps) {
    const { currentPrayer, nextPrayer, getDisplayName } = usePrayerTimes();

    return (
        <div className={`prayer-status-card ${className}`}>
            <div className="prayer-status-card__current">
                {currentPrayer
                    ? `Waktu ${getDisplayName(currentPrayer)}`
                    : 'Menunggu waktu sholat'
                }
            </div>

            {nextPrayer && (
                <div className="prayer-status-card__next">
                    <span>Selanjutnya:</span>
                    <strong>{getDisplayName(nextPrayer.name)}</strong>
                    <span>({formatTimeShort(nextPrayer.time, true)})</span>
                </div>
            )}
        </div>
    );
}

export default PrayerStatusCard;
