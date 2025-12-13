// Countdown Display Component
import { formatCountdownWithLabels } from '../../utils/formatters';
import './Common.css';

interface CountdownDisplayProps {
    seconds: number;
    showLabels?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export function CountdownDisplay({
    seconds,
    showLabels = true,
    size = 'medium',
    className = '',
}: CountdownDisplayProps) {
    const countdown = formatCountdownWithLabels(seconds);

    return (
        <div className={`countdown-display countdown-display--${size} ${className}`}>
            {countdown.hasHours && (
                <>
                    <div className="countdown-display__segment">
                        <span className="countdown-display__value">{countdown.hours}</span>
                        {showLabels && <span className="countdown-display__label">Jam</span>}
                    </div>
                    <span className="countdown-display__separator">:</span>
                </>
            )}

            <div className="countdown-display__segment">
                <span className="countdown-display__value">{countdown.minutes}</span>
                {showLabels && <span className="countdown-display__label">Menit</span>}
            </div>

            <span className="countdown-display__separator">:</span>

            <div className="countdown-display__segment">
                <span className="countdown-display__value">{countdown.seconds}</span>
                {showLabels && <span className="countdown-display__label">Detik</span>}
            </div>
        </div>
    );
}

export default CountdownDisplay;
