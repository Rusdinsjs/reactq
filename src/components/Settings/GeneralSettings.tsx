import { useSettingsStore } from '../../stores/settingsStore';
import { LogoPicker } from './LogoPicker';
import type { ThemeName } from '../../types/settings.types';
import './Settings.css';

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

export function GeneralSettings() {
    const {
        theme, setTheme,
        location, setLocation,
        mosque, setMosqueInfo
    } = useSettingsStore();

    return (
        <div className="settings-page general-settings">
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
        </div>
    );
}
