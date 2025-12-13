// Mosque Contact Component

import { useSettings } from '../../hooks/useSettings';
import './MosqueInfo.css';

interface MosqueContactProps {
    className?: string;
}

export function MosqueContact({ className = '' }: MosqueContactProps) {
    const { mosque } = useSettings();

    if (!mosque.address && !mosque.city) {
        return null;
    }

    return (
        <div className={`mosque-contact ${className}`}>
            {mosque.address && (
                <div className="mosque-contact__item">
                    <span className="mosque-contact__icon">📍</span>
                    <span className="mosque-contact__text">{mosque.address}</span>
                </div>
            )}

            {mosque.city && (
                <div className="mosque-contact__item">
                    <span className="mosque-contact__icon">🏙️</span>
                    <span className="mosque-contact__text">{mosque.city}</span>
                </div>
            )}
        </div>
    );
}

export default MosqueContact;
