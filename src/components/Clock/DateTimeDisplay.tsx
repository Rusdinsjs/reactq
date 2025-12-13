// Date Time Display Component - Combined clock and dates

import { DigitalClock } from './DigitalClock';
import { HijriDate } from './HijriDate';
import { GregorianDate } from './GregorianDate';
import { useSettings } from '../../hooks/useSettings';
import './Clock.css';

interface DateTimeDisplayProps {
    showClock?: boolean;
    showHijriDate?: boolean;
    showGregorianDate?: boolean;
    clockSize?: 'small' | 'medium' | 'large';
    className?: string;
}

export function DateTimeDisplay({
    showClock = true,
    showHijriDate,
    showGregorianDate,
    clockSize = 'large',
    className = '',
}: DateTimeDisplayProps) {
    const { display } = useSettings();

    // Use props or fall back to settings
    const showHijri = showHijriDate ?? display.showHijriDate;
    const showGregorian = showGregorianDate ?? display.showGregorianDate;

    return (
        <div className={`datetime-display ${className}`}>
            {showClock && (
                <div className="datetime-display__clock">
                    <DigitalClock size={clockSize} />
                </div>
            )}

            {(showHijri || showGregorian) && (
                <div className="datetime-display__dates">
                    {showGregorian && <GregorianDate />}
                    {showHijri && showGregorian && <div className="datetime-display__divider" />}
                    {showHijri && <HijriDate />}
                </div>
            )}
        </div>
    );
}

export default DateTimeDisplay;
