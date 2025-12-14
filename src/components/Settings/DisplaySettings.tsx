import { useSettingsStore } from '../../stores/settingsStore';
import type { PrayerTimesLayoutOption } from '../../types/settings.types';
import './Settings.css';

export function DisplaySettings() {
    const { display, setDisplaySettings } = useSettingsStore();

    return (
        <div className="settings-page display-settings">
            <section className="settings-section">
                <h2 className="settings-section__title">🖥️ Tampilan Umum</h2>

                <div className="settings-row">
                    <div className="settings-group">
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={display.fullscreen}
                                onChange={(e) => setDisplaySettings({ fullscreen: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Mode Layar Penuh</span>
                        </label>
                    </div>

                    <div className="settings-group">
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={display.showSeconds}
                                onChange={(e) => setDisplaySettings({ showSeconds: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Tampilkan Detik</span>
                        </label>
                    </div>

                    <div className="settings-group">
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={display.show24Hour}
                                onChange={(e) => setDisplaySettings({ show24Hour: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Format 24 Jam</span>
                        </label>
                    </div>
                </div>

                <div className="settings-row">
                    <div className="settings-group">
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={display.showHijriDate}
                                onChange={(e) => setDisplaySettings({ showHijriDate: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Tampilkan Tanggal Hijriah</span>
                        </label>
                    </div>

                    <div className="settings-group">
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={display.showGregorianDate}
                                onChange={(e) => setDisplaySettings({ showGregorianDate: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Tampilkan Tanggal Masehi</span>
                        </label>
                    </div>
                </div>

                <div className="settings-group">
                    <label className="settings-label">Ukuran Jam</label>
                    <select
                        className="settings-select"
                        value={display.clockSize}
                        onChange={(e) => setDisplaySettings({ clockSize: e.target.value as 'small' | 'medium' | 'large' })}
                    >
                        <option value="small">Kecil</option>
                        <option value="medium">Sedang</option>
                        <option value="large">Besar</option>
                    </select>
                </div>

                <div className="settings-group">
                    <label className="settings-label">Timeout Screensaver (Menit)</label>
                    <input
                        type="number"
                        className="settings-input"
                        value={display.screensaverTimeout}
                        onChange={(e) => setDisplaySettings({ screensaverTimeout: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </section>

            <section className="settings-section">
                <h2 className="settings-section__title">🕌 Tampilan Jeda Waktu Sholat</h2>
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
                            Kecepatan Rotasi Info: {display.prayerTimesCarouselSpeed} detik
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            className="settings-range"
                            value={display.prayerTimesCarouselSpeed}
                            onChange={(e) => setDisplaySettings({ prayerTimesCarouselSpeed: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
