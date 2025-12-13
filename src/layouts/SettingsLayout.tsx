// Settings Layout - Modal style overlay on Dashboard
import { type ReactNode } from 'react';
import { useScreenManager } from '../hooks/useScreenManager';
import './Layouts.css';

interface SettingsLayoutProps {
    children: ReactNode;
    title?: string;
}

export function SettingsLayout({ children, title = 'Pengaturan' }: SettingsLayoutProps) {
    const { returnToDashboard } = useScreenManager();

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            returnToDashboard();
        }
    };

    return (
        <div className="settings-modal" onClick={handleBackdropClick}>
            <div className="settings-modal__backdrop" />
            <div className="settings-modal__container">
                <div className="settings-modal__header">
                    <h1 className="settings-modal__title">{title}</h1>
                    <button
                        className="settings-modal__close-btn"
                        onClick={returnToDashboard}
                        title="Tutup"
                    >
                        ✕
                    </button>
                </div>
                <div className="settings-modal__body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SettingsLayout;
