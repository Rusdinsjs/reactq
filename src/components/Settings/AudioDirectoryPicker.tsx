// Audio Directory Picker Component

import { useState } from 'react';
import { openFolderDialog } from '../../services/tauriBridge';
import './Settings.css';

interface AudioDirectoryPickerProps {
    currentDirectory: string;
    onDirectoryChange: (directory: string) => void;
}

export function AudioDirectoryPicker({
    currentDirectory,
    onDirectoryChange,
}: AudioDirectoryPickerProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectDirectory = async () => {
        setIsLoading(true);

        try {
            const directory = await openFolderDialog('Pilih Folder Audio');
            if (directory) {
                onDirectoryChange(directory);
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="audio-directory-picker">
            <div className="audio-directory-picker__header">
                <h3 className="audio-directory-picker__title">
                    📁 Folder Audio Eksternal
                </h3>
            </div>

            <div className="audio-directory-picker__path">
                <span className="audio-directory-picker__path-text">
                    {currentDirectory || 'Folder belum dipilih (menggunakan default)'}
                </span>
                <button
                    className="audio-directory-picker__btn"
                    onClick={handleSelectDirectory}
                    disabled={isLoading}
                >
                    {isLoading ? 'Memilih...' : 'Pilih Folder'}
                </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                File audio akan disimpan di folder eksternal agar tidak menambah ukuran aplikasi.
            </p>
        </div>
    );
}

export default AudioDirectoryPicker;
