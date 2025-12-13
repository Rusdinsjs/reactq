// Digital Clock Component

import { useState, useEffect } from 'react';
import { formatTime } from '../../utils/formatters';
import { useSettings } from '../../hooks/useSettings';
import './Clock.css';

interface DigitalClockProps {
    showSeconds?: boolean;
    show24Hour?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export function DigitalClock({
    showSeconds,
    show24Hour,
    size = 'large',
    className = ''
}: DigitalClockProps) {
    const [time, setTime] = useState(new Date());
    const { display } = useSettings();

    // Use props or fall back to settings
    const showSecs = showSeconds ?? display.showSeconds;
    const use24Hour = show24Hour ?? display.show24Hour;

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeDisplay = formatTime(time, use24Hour);
    const timeString = use24Hour ? timeDisplay.formatted24 : timeDisplay.formatted12;

    // Split time into parts for styling
    const [hourMin, secPart] = showSecs
        ? [timeString.slice(0, 5), timeString.slice(6)]
        : [timeString.slice(0, 5), ''];

    return (
        <div className={`digital-clock digital-clock--${size} ${className}`}>
            <div className="digital-clock__time">
                <span className="digital-clock__hour-min">{hourMin}</span>
                {showSecs && (
                    <>
                        <span className="digital-clock__separator">:</span>
                        <span className="digital-clock__seconds">{secPart.slice(0, 2)}</span>
                    </>
                )}
                {!use24Hour && (
                    <span className="digital-clock__period">{timeDisplay.period}</span>
                )}
            </div>
        </div>
    );
}

export default DigitalClock;
