// Hijri Date Component

import { useState, useEffect } from 'react';
import { toHijri, getHijriMonthName } from '../../services/hijriConverter';
import { useSettings } from '../../hooks/useSettings';
import './Clock.css';

interface HijriDateProps {
    date?: Date;
    showArabic?: boolean;
    className?: string;
}

export function HijriDate({ date, showArabic = true, className = '' }: HijriDateProps) {
    const [hijriDate, setHijriDate] = useState(() => toHijri(date ?? new Date()));
    const { language } = useSettings();

    useEffect(() => {
        const updateDate = () => {
            setHijriDate(toHijri(date ?? new Date()));
        };

        // Update at midnight
        const now = new Date();
        const msUntilMidnight =
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

        const timeout = setTimeout(() => {
            updateDate();
            // Then update every 24 hours
            const interval = setInterval(updateDate, 24 * 60 * 60 * 1000);
            return () => clearInterval(interval);
        }, msUntilMidnight);

        return () => clearTimeout(timeout);
    }, [date]);

    return (
        <div className={`hijri-date ${className}`}>
            <div className="hijri-date__main">
                <span className="hijri-date__day">{hijriDate.day}</span>
                <span className="hijri-date__month">{getHijriMonthName(hijriDate.month, language)}</span>
                <span className="hijri-date__year">{hijriDate.year} H</span>
            </div>
            {showArabic && (
                <div className="hijri-date__arabic">
                    {hijriDate.day} {hijriDate.monthNameAr} {hijriDate.year} هـ
                </div>
            )}
        </div>
    );
}

export default HijriDate;
