// Mosque Logo Component

import { useSettings } from '../../hooks/useSettings';
import './MosqueInfo.css';

interface MosqueLogoProps {
    className?: string;
    showName?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export function MosqueLogo({
    className = '',
    showName = true,
    size = 'medium',
}: MosqueLogoProps) {
    const { mosque } = useSettings();

    const sizeMap = {
        small: '60px',
        medium: '120px',
        large: '180px',
    };

    return (
        <div className={`mosque-logo mosque-logo--${size} ${className}`}>
            {mosque.logoPath ? (
                <img
                    src={mosque.logoPath}
                    alt={mosque.name}
                    className="mosque-logo__image"
                    style={{ width: sizeMap[size], height: sizeMap[size] }}
                />
            ) : (
                <div
                    className="mosque-logo__placeholder"
                    style={{ width: sizeMap[size], height: sizeMap[size] }}
                >
                    🕌
                </div>
            )}

            {showName && (
                <div className="mosque-logo__name">{mosque.name || 'Masjid'}</div>
            )}
        </div>
    );
}

export default MosqueLogo;
