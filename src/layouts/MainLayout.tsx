// Main Layout - Primary dashboard layout
import { type ReactNode } from 'react';
import { MosqueHeader } from '../components/MosqueInfo';
import { RunningText } from '../components/Media';
import { PrayerNotification } from '../components/Common';
import './Layouts.css';

interface MainLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    showRunningText?: boolean;
}

export function MainLayout({
    children,
    showHeader = true,
    showRunningText = true,
}: MainLayoutProps) {
    return (
        <div className="main-layout">
            {showHeader && (
                <header className="main-layout__header">
                    <MosqueHeader />
                </header>
            )}

            <main className="main-layout__content">
                {children}
            </main>

            {showRunningText && (
                <footer className="main-layout__footer">
                    <RunningText />
                </footer>
            )}

            <PrayerNotification />
        </div>
    );
}

export default MainLayout;
