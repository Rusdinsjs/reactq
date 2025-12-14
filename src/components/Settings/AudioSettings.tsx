import { useSettingsStore } from '../../stores/settingsStore';
import { AudioDirectoryPicker } from './AudioDirectoryPicker';
import { PrayerAudioSettingsEditor } from './AudioFilePicker';
import type { MainPrayerName } from '../../types/prayer.types';
import type { PrayerAudioSettings } from '../../types/settings.types';
import './Settings.css';

const PRAYERS: MainPrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function AudioSettings() {
    const { audio, setAudioSettings } = useSettingsStore();

    const handlePrayerAudioChange = (prayer: MainPrayerName, settings: Partial<PrayerAudioSettings>) => {
        setAudioSettings({
            prayers: {
                ...audio.prayers,
                [prayer]: { ...audio.prayers[prayer], ...settings },
            },
        });
    };

    return (
        <div className="settings-page audio-settings">
            <section className="settings-section">
                <h2 className="settings-section__title">🔊 Pengaturan Audio Global</h2>

                {/* Audio Directory */}
                <AudioDirectoryPicker
                    currentDirectory={audio.audioDirectory}
                    onDirectoryChange={(dir) => setAudioSettings({ audioDirectory: dir })}
                />

                <div className="settings-group">
                    <label className="settings-label">Volume Master: {Math.round(audio.volume * 100)}%</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        className="settings-range"
                        value={audio.volume}
                        onChange={(e) => setAudioSettings({ volume: parseFloat(e.target.value) })}
                    />
                </div>

                {/* Global Duration Settings */}
                <div className="duration-settings">
                    <div className="duration-setting">
                        <label className="duration-setting__label">Durasi Tartil Sebelum Sholat</label>
                        <div className="duration-setting__input">
                            <input
                                type="number"
                                min="5"
                                max="60"
                                value={audio.globalTartilDuration}
                                onChange={(e) => setAudioSettings({ globalTartilDuration: parseInt(e.target.value) || 20 })}
                            />
                            <span className="duration-setting__unit">menit</span>
                        </div>
                    </div>
                    <div className="duration-setting">
                        <label className="duration-setting__label">Tunggu Iqamah</label>
                        <div className="duration-setting__input">
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={audio.globalIqamahWaitDuration}
                                onChange={(e) => setAudioSettings({ globalIqamahWaitDuration: parseInt(e.target.value) || 10 })}
                            />
                            <span className="duration-setting__unit">menit</span>
                        </div>
                    </div>
                    <div className="duration-setting">
                        <label className="duration-setting__label">Durasi Waktu Sholat</label>
                        <div className="duration-setting__input">
                            <input
                                type="number"
                                min="5"
                                max="60"
                                value={audio.globalPrayerDuration}
                                onChange={(e) => setAudioSettings({ globalPrayerDuration: parseInt(e.target.value) || 15 })}
                            />
                            <span className="duration-setting__unit">menit</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Per-Prayer Audio Files */}
            <section className="settings-section">
                <h2 className="settings-section__title">🎵 File Audio Per Waktu Sholat</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    Pilih file audio dari folder eksternal. Durasi akan otomatis mengikuti durasi file.
                </p>

                {PRAYERS.map((prayer) => (
                    <PrayerAudioSettingsEditor
                        key={prayer}
                        prayer={prayer}
                        settings={audio.prayers[prayer]}
                        globalDefaults={{
                            tartil: audio.globalTartilDuration,
                            iqamah: audio.globalIqamahWaitDuration,
                            prayer: audio.globalPrayerDuration,
                        }}
                        audioDirectory={audio.audioDirectory}
                        onSettingsChange={(settings) => handlePrayerAudioChange(prayer, settings)}
                    />
                ))}
            </section>
        </div>
    );
}
