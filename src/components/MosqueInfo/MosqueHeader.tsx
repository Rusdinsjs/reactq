// Mosque Header Component

import { useSettings } from '../../hooks/useSettings';
import { convertFileSrc } from '@tauri-apps/api/core';
import './MosqueInfo.css';

interface MosqueHeaderProps {
    className?: string;
    showLogo?: boolean;
    showAddress?: boolean;
}

export function MosqueHeader({
    className = '',
    showLogo = true,
    showAddress = true,
}: MosqueHeaderProps) {
    const { mosque } = useSettings();

    return (
        <div className={`mosque-header ${className}`}>
            {showLogo && (
                <div className="mosque-header__logo-container">
                    {mosque.logoPath ? (
                        <img
                            src={mosque.logoPath.startsWith('http') || mosque.logoPath.startsWith('blob:')
                                ? mosque.logoPath
                                : convertFileSrc(mosque.logoPath)}
                            alt={mosque.name}
                            className="mosque-header__logo"
                        />
                    ) : (
                        <div className="mosque-header__icon" style={{ fontSize: '2.5rem' }}>🕌</div>
                    )}
                </div>
            )}

            <div className="mosque-header__info">
                <h1 className="mosque-header__name">{mosque.name || 'Masjid'}</h1>
                {showAddress && (mosque.address || mosque.city) && (
                    <div className="mosque-header__address">
                        {mosque.address && <span>{mosque.address}</span>}
                        {mosque.address && mosque.city && <span> - </span>}
                        {mosque.city && <span>{mosque.city}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MosqueHeader;
