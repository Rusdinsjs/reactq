// Prayer Layout - For prayer flow screens
import { type ReactNode } from 'react';
import './Layouts.css';

interface PrayerLayoutProps {
    children: ReactNode;
}

export function PrayerLayout({ children }: PrayerLayoutProps) {
    return (
        <div className="prayer-layout">
            <div className="prayer-layout__content">
                {children}
            </div>
        </div>
    );
}

export default PrayerLayout;
