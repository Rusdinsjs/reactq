// Settings Page
import { SettingsLayout } from '../layouts';
import { useSettings } from '../hooks/useSettings';
import { CALCULATION_METHODS } from '../utils/constants';
import { AudioDirectoryPicker, PrayerAudioSettingsEditor, LogoPicker } from '../components/Settings';
import type { CalculationMethod, AsrJuristic, MainPrayerName } from '../types/prayer.types';
import type { ThemeName, PrayerAudioSettings, PrayerTimesLayoutOption } from '../types/settings.types';
import '../components/Settings/Settings.css';
import './Pages.css';

const THEMES: { value: ThemeName; label: string }[] = [
    { value: 'light', label: 'Terang' },
    { value: 'dark', label: 'Gelap' },
    { value: 'green', label: 'Hijau' },
    { value: 'blue', label: 'Biru' },
    { value: 'gold', label: 'Emas' },
    { value: 'purple', label: 'Ungu' },
    { value: 'red', label: 'Merah' },
    { value: 'teal', label: 'Teal' },
    { value: 'custom', label: 'Kustom' },
];

const PRAYERS: MainPrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function Settings() {
    const {
        theme,
        setTheme,
        calculationMethod,
        setCalculationMethod,
        asrJuristic,
        setAsrJuristic,
        location,
        setLocation,
        audio,
        setAudioSettings,
        mosque,
        setMosqueInfo,
        corrections,
        setCorrections,
        display,
        setDisplaySettings,
        runningText,
        setRunningTextSettings,
    } = useSettings();

    const handlePrayerAudioChange = (prayer: MainPrayerName, settings: Partial<PrayerAudioSettings>) => {
        setAudioSettings({
            prayers: {
                ...audio.prayers,
                [prayer]: { ...audio.prayers[prayer], ...settings },
            },
        });
    };

    return (
        <SettingsLayout title="Pengaturan">
            <div className="settings-page">
                {/* Theme Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">🎨 Tema</h2>
                    <div className="settings-group">
                        <label className="settings-label">Pilih Tema</label>
                        <select
                            className="settings-select"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as ThemeName)}
                        >
                            {THEMES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Location Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">📍 Lokasi</h2>
                    <div className="settings-row">
                        <div className="settings-group">
                            <label className="settings-label">Kota</label>
                            <input
                                type="text"
                                className="settings-input"
                                value={location.city}
                                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                            />
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Negara</label>
                            <input
                                type="text"
                                className="settings-input"
                                value={location.country}
                                onChange={(e) => setLocation({ ...location, country: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="settings-group">
                            <label className="settings-label">Latitude</label>
                            <input
                                type="number"
                                step="0.0001"
                                className="settings-input"
                                value={location.latitude}
                                onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Longitude</label>
                            <input
                                type="number"
                                step="0.0001"
                                className="settings-input"
                                value={location.longitude}
                                onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Timezone (GMT+)</label>
                            <input
                                type="number"
                                className="settings-input"
                                value={location.timezone}
                                onChange={(e) => setLocation({ ...location, timezone: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </section>

                {/* Prayer Calculation Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">🕌 Kalkulasi Waktu Sholat</h2>
                    <div className="settings-row">
                        <div className="settings-group">
                            <label className="settings-label">Metode Kalkulasi</label>
                            <select
                                className="settings-select"
                                value={calculationMethod}
                                onChange={(e) => setCalculationMethod(e.target.value as CalculationMethod)}
                            >
                                {Object.entries(CALCULATION_METHODS).map(([key, method]) => (
                                    <option key={key} value={key}>{method.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Mazhab Asr</label>
                            <select
                                className="settings-select"
                                value={asrJuristic}
                                onChange={(e) => setAsrJuristic(e.target.value as AsrJuristic)}
                            >
                                <option value="Standard">Syafi'i/Maliki/Hambali</option>
                                <option value="Hanafi">Hanafi</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Display Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">🖥️ Tampilan</h2>
                    <div className="settings-row">
                        <div className="settings-group">
                            <label className="settings-label">Posisi Waktu Sholat</label>
                            <select
                                className="settings-select"
                                value={display.prayerTimesLayout}
                                onChange={(e) => setDisplaySettings({ prayerTimesLayout: e.target.value as PrayerTimesLayoutOption })}
                            >
                                <option value="horizontal">Horizontal (Bawah)</option>
                                <option value="vertical-left">Vertical (Sisi Kiri)</option>
                                <option value="vertical-right">Vertical (Sisi Kanan)</option>
                            </select>
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">
                                Kecepatan Carousel: {display.prayerTimesCarouselSpeed}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="settings-range"
                                value={display.prayerTimesCarouselSpeed}
                                onChange={(e) => setDisplaySettings({ prayerTimesCarouselSpeed: parseInt(e.target.value) })}
                            />
                            <div className="settings-range-labels">
                                <span>Lambat</span>
                                <span>Cepat</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Running Text Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">📜 Running Text</h2>
                    <div className="settings-row">
                        <div className="settings-group">
                            <label className="settings-label">
                                Kecepatan: {runningText.speed}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="settings-range"
                                value={runningText.speed}
                                onChange={(e) => setRunningTextSettings({ speed: parseInt(e.target.value) })}
                            />
                            <div className="settings-range-labels">
                                <span>Lambat</span>
                                <span>Cepat</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Correction Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">⏱️ Koreksi Waktu (menit)</h2>
                    <div className="settings-row">
                        {Object.entries(corrections).map(([key, value]) => (
                            <div key={key} className="settings-group">
                                <label className="settings-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input
                                    type="number"
                                    className="settings-input"
                                    value={value}
                                    onChange={(e) => setCorrections({ ...corrections, [key]: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Audio Settings - Global Durations */}
                <section className="settings-section">
                    <h2 className="settings-section__title">🔊 Pengaturan Audio</h2>

                    {/* Audio Directory */}
                    <AudioDirectoryPicker
                        currentDirectory={audio.audioDirectory}
                        onDirectoryChange={(dir) => setAudioSettings({ audioDirectory: dir })}
                    />

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

                {/* Mosque Settings */}
                <section className="settings-section">
                    <h2 className="settings-section__title">🏛️ Informasi Masjid</h2>
                    <div className="settings-row">
                        <LogoPicker
                            currentLogo={mosque.logoPath}
                            onLogoChange={(path) => setMosqueInfo({ logoPath: path })}
                        />
                        <div className="settings-group">
                            <label className="settings-label">Nama Masjid</label>
                            <input
                                type="text"
                                className="settings-input"
                                value={mosque.name}
                                onChange={(e) => setMosqueInfo({ name: e.target.value })}
                            />
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Kota</label>
                            <input
                                type="text"
                                className="settings-input"
                                value={mosque.city}
                                onChange={(e) => setMosqueInfo({ city: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="settings-group">
                        <label className="settings-label">Alamat</label>
                        <input
                            type="text"
                            className="settings-input"
                            value={mosque.address}
                            onChange={(e) => setMosqueInfo({ address: e.target.value })}
                        />
                    </div>
                </section>
            </div>
        </SettingsLayout>
    );
}

export default Settings;
