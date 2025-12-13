// Settings Layout - For settings page
import { type ReactNode } from 'react';
import { useScreenManager } from '../hooks/useScreenManager';
import './Layouts.css';

interface SettingsLayoutProps {
    children: ReactNode;
    title?: string;
}

export function SettingsLayout({ children, title = 'Pengaturan' }: SettingsLayoutProps) {
    const { returnToDashboard } = useScreenManager();

    return (
        <div className="settings-layout">
            <div className="settings-layout__content">
                <div className="settings-layout__header">
                    <h1 className="settings-layout__title">{title}</h1>
                    <button className="settings-layout__back-btn" onClick={returnToDashboard}>
                        ← Kembali
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default SettingsLayout;
