// Fullscreen Layout - For screensaver/analog clock
import { type ReactNode } from 'react';
import './Layouts.css';

interface FullscreenLayoutProps {
    children: ReactNode;
    onClick?: () => void;
}

export function FullscreenLayout({ children, onClick }: FullscreenLayoutProps) {
    return (
        <div className="fullscreen-layout" onClick={onClick}>
            <div className="fullscreen-layout__content">
                {children}
            </div>
        </div>
    );
}

export default FullscreenLayout;
