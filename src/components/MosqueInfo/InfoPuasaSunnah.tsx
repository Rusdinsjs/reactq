
import { useEffect, useState } from 'react';
import { toHijri, toGregorian, getHijriMonthName } from '../../services/hijriConverter';

interface InfoPuasaSunnahProps {
    className?: string;
}

interface FastingInfo {
    name: string;
    daysUntil: number;
    dateName: string; // "Besok" or "Senin, 12 Rajab"
    hijriDate: string;
}

export function InfoPuasaSunnah({ className = '' }: InfoPuasaSunnahProps) {
    const [fastingInfo, setFastingInfo] = useState<FastingInfo | null>(null);

    useEffect(() => {
        calculateNextFasting();
        const interval = setInterval(calculateNextFasting, 60000 * 60); // Check every hour
        return () => clearInterval(interval);
    }, []);

    const calculateNextFasting = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let candidates: { name: string; date: Date; priority: number }[] = [];

        // 1. Senin & Kamis (check next 7 days)
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() + i);
            const day = checkDate.getDay(); // 1 = Senin, 4 = Kamis

            if (day === 1) {
                candidates.push({ name: 'Puasa Senin', date: checkDate, priority: 2 });
            } else if (day === 4) {
                candidates.push({ name: 'Puasa Kamis', date: checkDate, priority: 2 });
            }
        }

        // 2. Ayyamul Bidh (13, 14, 15 Hijri)
        const hijriToday = toHijri(today);
        const ayyamulBidhDates = [13, 14, 15];

        // Check current Hijri month
        ayyamulBidhDates.forEach(d => {
            const gregDate = toGregorian(hijriToday.year, hijriToday.month, d);
            gregDate.setHours(0, 0, 0, 0);
            if (gregDate >= today) {
                candidates.push({ name: 'Puasa Ayyamul Bidh', date: gregDate, priority: 1 });
            }
        });

        // Check next Hijri month if needed (if today is late in the month)
        if (hijriToday.day > 15) {
            const nextMonth = hijriToday.month === 12 ? 1 : hijriToday.month + 1;
            const nextYear = hijriToday.month === 12 ? hijriToday.year + 1 : hijriToday.year;

            ayyamulBidhDates.forEach(d => {
                const gregDate = toGregorian(nextYear, nextMonth, d);
                gregDate.setHours(0, 0, 0, 0);
                candidates.push({ name: 'Puasa Ayyamul Bidh', date: gregDate, priority: 1 });
            });
        }

        // 3. Sort by date, then priority
        candidates.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Helper to formatting
        if (candidates.length > 0) {
            const next = candidates[0];
            const diffTime = Math.abs(next.date.getTime() - today.getTime());
            const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const nextHijri = toHijri(next.date);
            const hijriStr = `${nextHijri.day} ${getHijriMonthName(nextHijri.month, 'id')} ${nextHijri.year} H`;

            let dateName = "";
            if (daysUntil === 1) {
                dateName = "Besok";
            } else if (daysUntil === 0) {
                dateName = "Hari Ini";
            } else {
                dateName = `${daysUntil} Hari Lagi`;
            }

            setFastingInfo({
                name: next.name,
                daysUntil,
                dateName,
                hijriDate: hijriStr
            });
        }
    };

    if (!fastingInfo) return null;

    return (
        <div className={`info-puasa-sunnah ${className}`}>
            <div className="info-puasa-sunnah__label">{(fastingInfo.daysUntil === 0) ? "PUASA SUNNAH" : "PUASA SUNNAH BERIKUTNYA"}</div>
            <div className="info-puasa-sunnah__name">{fastingInfo.name}</div>
            <div className="info-puasa-sunnah__countdown">
                <span className="info-puasa-sunnah__highlight">{fastingInfo.dateName}</span>
            </div>
            <div className="info-puasa-sunnah__date">{fastingInfo.hijriDate}</div>
        </div>
    );
}

export default InfoPuasaSunnah;
