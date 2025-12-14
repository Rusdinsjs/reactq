import { useState } from 'react';
import { openImageFileDialog } from '../../services/tauriBridge';
import { convertFileSrc } from '@tauri-apps/api/core';

interface LogoPickerProps {
    currentLogo?: string;
    onLogoChange: (path: string) => void;
}

export function LogoPicker({ currentLogo, onLogoChange }: LogoPickerProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectLogo = async () => {
        setIsLoading(true);
        try {
            const selectedPath = await openImageFileDialog();
            if (selectedPath) {
                // If it's an absolute path (from Tauri), convert it
                // But for storing in settings, we keep the original path
                // The display component will handle conversion if needed
                onLogoChange(selectedPath);
            }
        } catch (error) {
            console.error('Failed to select logo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearLogo = () => {
        onLogoChange('');
    };

    // Helper to display the image source correctly
    const getDisplaySrc = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('blob:')) return path; // Web URLs
        // For local files in Tauri, we might need convertFileSrc depending on usage
        // But the MosqueHeader usually handles this if we pass plain path?
        // Let's use convertFileSrc here for preview to be safe
        try {
            return convertFileSrc(path);
        } catch {
            return path;
        }
    };

    return (
        <div className="settings-group">
            <label className="settings-label">Logo Masjid</label>
            <div className="logo-picker-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                    className="logo-preview"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {currentLogo ? (
                        <img
                            src={getDisplaySrc(currentLogo)}
                            alt="Logo Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <span style={{ fontSize: '1.5rem' }}>🕌</span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <button
                        className="settings-btn settings-btn--secondary"
                        onClick={handleSelectLogo}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                    >
                        {isLoading ? 'Membuka...' : (currentLogo ? 'Ganti Logo' : 'Pilih Logo')}
                    </button>

                    {currentLogo && (
                        <button
                            className="settings-btn"
                            onClick={handleClearLogo}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'var(--color-error)',
                                border: 'none'
                            }}
                            title="Hapus Logo"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
            {currentLogo && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                    {currentLogo}
                </div>
            )}
        </div>
    );
}
