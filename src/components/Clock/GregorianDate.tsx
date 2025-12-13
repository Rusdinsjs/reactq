// Gregorian Date Component

import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { useSettings } from '../../hooks/useSettings';
import './Clock.css';

interface GregorianDateProps {
    date?: Date;
    showDayName?: boolean;
    className?: string;
}

export function GregorianDate({ date, showDayName = true, className = '' }: GregorianDateProps) {
    const [currentDate, setCurrentDate] = useState(() => date ?? new Date());
    const { language } = useSettings();

    useEffect(() => {
        if (date) {
            setCurrentDate(date);
            return;
        }

        // Update at midnight
        const updateDate = () => setCurrentDate(new Date());
        const now = new Date();
        const msUntilMidnight =
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

        const timeout = setTimeout(() => {
            updateDate();
            const interval = setInterval(updateDate, 24 * 60 * 60 * 1000);
            return () => clearInterval(interval);
        }, msUntilMidnight);

        return () => clearTimeout(timeout);
    }, [date]);

    const dateDisplay = formatDate(currentDate, language);

    return (
        <div className={`gregorian-date ${className}`}>
            {showDayName && (
                <div className="gregorian-date__day-name">{dateDisplay.dayName}</div>
            )}
            <div className="gregorian-date__full">
                {dateDisplay.date} {dateDisplay.monthName} {dateDisplay.year}
            </div>
        </div>
    );
}

export default GregorianDate;
