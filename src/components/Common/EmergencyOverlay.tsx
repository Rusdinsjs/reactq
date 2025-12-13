// Emergency Overlay Component
import './Common.css';

interface EmergencyOverlayProps {
    title: string;
    message: string;
    icon?: string;
    onClose?: () => void;
}

export function EmergencyOverlay({
    title,
    message,
    icon = '⚠️',
    onClose,
}: EmergencyOverlayProps) {
    return (
        <div className="emergency-overlay" onClick={onClose}>
            <div className="emergency-overlay__content">
                <div className="emergency-overlay__icon">{icon}</div>
                <div className="emergency-overlay__title">{title}</div>
                <div className="emergency-overlay__message">{message}</div>
            </div>
        </div>
    );
}

export default EmergencyOverlay;
