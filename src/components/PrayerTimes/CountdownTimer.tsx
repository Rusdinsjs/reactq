// Countdown Timer Component

import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { formatCountdownWithLabels } from '../../utils/formatters';
import './PrayerTimes.css';

interface CountdownTimerProps {
    className?: string;
    showPrayerName?: boolean;
    showLabels?: boolean;
}

export function CountdownTimer({
    className = '',
    showPrayerName = true,
    showLabels = true,
}: CountdownTimerProps) {
    const { nextPrayer, secondsUntilNextPrayer, getDisplayName } = usePrayerTimes();

    if (!nextPrayer) {
        return null;
    }

    const countdown = formatCountdownWithLabels(secondsUntilNextPrayer);

    return (
        <div className={`countdown-timer ${className}`}>
            <div className="countdown-timer__label">
                Waktu Menuju
            </div>
            {showPrayerName && (
                <div className="countdown-timer__prayer-name">
                    SHOLAT {getDisplayName(nextPrayer.name)}
                </div>
            )}
            <div className="countdown-timer__time">
                {countdown.hasHours && (
                    <>
                        <div className="countdown-timer__segment">
                            <span className="countdown-timer__segment-value">{countdown.hours}</span>
                            {showLabels && <span className="countdown-timer__segment-label">Jam</span>}
                        </div>
                        <span className="countdown-timer__separator">:</span>
                    </>
                )}

                <div className="countdown-timer__segment">
                    <span className="countdown-timer__segment-value">{countdown.minutes}</span>
                    {showLabels && <span className="countdown-timer__segment-label">Menit</span>}
                </div>

                <span className="countdown-timer__separator">:</span>

                <div className="countdown-timer__segment">
                    <span className="countdown-timer__segment-value">{countdown.seconds}</span>
                    {showLabels && <span className="countdown-timer__segment-label">Detik</span>}
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;
