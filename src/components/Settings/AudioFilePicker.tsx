// Audio File Picker Component - Select audio files from external folder

import { useState } from 'react';
import { openAudioFileDialog, getAudioDuration, copyAudioFile } from '../../services/tauriBridge';
import type { MainPrayerName } from '../../types/prayer.types';
import type { PrayerAudioSettings } from '../../types/settings.types';
import './Settings.css';

interface AudioFilePickerProps {
    prayer: MainPrayerName;
    audioType: 'tartil' | 'tarhim' | 'adhan';
    currentFile: string;
    currentDuration: number;
    audioDirectory?: string;
    onFileChange: (file: string, duration: number) => void;
    className?: string;
}

const AUDIO_TYPE_LABELS: Record<string, { id: string; icon: string }> = {
    tartil: { id: 'Tartil', icon: '📖' },
    tarhim: { id: 'Tarhim', icon: '🎵' },
    adhan: { id: 'Adzan', icon: '🔊' },
};

export function AudioFilePicker({
    prayer,
    audioType,
    currentFile,
    currentDuration,
    audioDirectory,
    onFileChange,
    className = '',
}: AudioFilePickerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const label = AUDIO_TYPE_LABELS[audioType];
    const fileName = currentFile ? currentFile.split(/[/\\]/).pop() : 'Belum dipilih';

    const handleSelectFile = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const sourcePath = await openAudioFileDialog(`Pilih File ${label.id} - ${prayer}`);

            if (sourcePath) {
                // Generate unique filename
                const originalName = sourcePath.split(/[/\\]/).pop() || 'audio.mp3';
                const uniqueName = `${prayer}_${audioType}_${originalName}`;

                // Copy file to audio directory (external or internal)
                const destPath = await copyAudioFile(sourcePath, uniqueName, audioDirectory);

                // Get audio duration
                const duration = await getAudioDuration(destPath);
                const durationMinutes = Math.ceil(duration / 60);

                onFileChange(destPath, durationMinutes);
            }
        } catch (err) {
            setError('Gagal memilih file');
            console.error('Error selecting audio file:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFile = () => {
        onFileChange('', 0);
    };

    const formatDuration = (minutes: number) => {
        if (minutes === 0) return 'Auto';
        return `${minutes} menit`;
    };

    return (
        <div className={`audio-file-picker ${className}`}>
            <div className="audio-file-picker__header">
                <span className="audio-file-picker__icon">{label.icon}</span>
                <span className="audio-file-picker__label">{label.id}</span>
            </div>

            <div className="audio-file-picker__content">
                <div className="audio-file-picker__file-info">
                    <span className="audio-file-picker__filename" title={currentFile}>
                        {fileName}
                    </span>
                    {currentFile && (
                        <span className="audio-file-picker__duration">
                            ({formatDuration(currentDuration)})
                        </span>
                    )}
                </div>

                <div className="audio-file-picker__actions">
                    <button
                        className="audio-file-picker__btn audio-file-picker__btn--select"
                        onClick={handleSelectFile}
                        disabled={isLoading}
                    >
                        {isLoading ? '...' : 'Pilih'}
                    </button>

                    {currentFile && (
                        <button
                            className="audio-file-picker__btn audio-file-picker__btn--clear"
                            onClick={handleClearFile}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="audio-file-picker__error">{error}</div>
            )}
        </div>
    );
}

// Prayer Audio Settings Component - Combines all audio pickers for a prayer
interface PrayerAudioSettingsProps {
    prayer: MainPrayerName;
    settings: PrayerAudioSettings;
    globalDefaults: { tartil: number; iqamah: number; prayer: number };
    audioDirectory?: string;
    onSettingsChange: (settings: Partial<PrayerAudioSettings>) => void;
}

export function PrayerAudioSettingsEditor({
    prayer,
    settings,
    globalDefaults,
    audioDirectory,
    onSettingsChange,
}: PrayerAudioSettingsProps) {
    const prayerLabels: Record<MainPrayerName, string> = {
        fajr: 'Subuh',
        dhuhr: 'Dzuhur',
        asr: 'Ashar',
        maghrib: 'Maghrib',
        isha: 'Isya',
    };

    return (
        <div className="prayer-audio-settings">
            <h4 className="prayer-audio-settings__title">
                🕌 {prayerLabels[prayer]}
            </h4>

            {/* Audio Files */}
            <div className="prayer-audio-settings__pickers">
                <AudioFilePicker
                    prayer={prayer}
                    audioType="tartil"
                    currentFile={settings.tartilFile}
                    currentDuration={0}
                    audioDirectory={audioDirectory}
                    onFileChange={(file) => onSettingsChange({ tartilFile: file })}
                />

                <AudioFilePicker
                    prayer={prayer}
                    audioType="tarhim"
                    currentFile={settings.tarhimFile}
                    currentDuration={0}
                    audioDirectory={audioDirectory}
                    onFileChange={(file) => onSettingsChange({ tarhimFile: file })}
                />

                <AudioFilePicker
                    prayer={prayer}
                    audioType="adhan"
                    currentFile={settings.adhanFile}
                    currentDuration={0}
                    audioDirectory={audioDirectory}
                    onFileChange={(file) => onSettingsChange({ adhanFile: file })}
                />
            </div>

            {/* Duration Settings */}
            <div className="prayer-audio-settings__durations">
                <div className="duration-input">
                    <label>Tartil Mulai</label>
                    <input
                        type="number"
                        min="0"
                        max="60"
                        value={settings.tartilStartBefore}
                        onChange={(e) => onSettingsChange({ tartilStartBefore: parseInt(e.target.value) || 0 })}
                        placeholder={`${globalDefaults.tartil}`}
                    />
                    <span>menit sebelum</span>
                </div>
                <div className="duration-input">
                    <label>Tunggu Iqamah</label>
                    <input
                        type="number"
                        min="0"
                        max="30"
                        value={settings.iqamahDuration}
                        onChange={(e) => onSettingsChange({ iqamahDuration: parseInt(e.target.value) || 0 })}
                        placeholder={`${globalDefaults.iqamah}`}
                    />
                    <span>menit</span>
                </div>
                <div className="duration-input">
                    <label>Durasi Sholat</label>
                    <input
                        type="number"
                        min="0"
                        max="60"
                        value={settings.prayerDuration}
                        onChange={(e) => onSettingsChange({ prayerDuration: parseInt(e.target.value) || 0 })}
                        placeholder={`${globalDefaults.prayer}`}
                    />
                    <span>menit</span>
                </div>
            </div>
            <p className="prayer-audio-settings__hint">0 = gunakan default global</p>
        </div>
    );
}

export default AudioFilePicker;
