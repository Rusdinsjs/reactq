import { useSettingsStore } from '../../stores/settingsStore';
import { CALCULATION_METHODS } from '../../utils/constants';
import type { CalculationMethod, AsrJuristic } from '../../types/prayer.types';
import './Settings.css';

export function PrayerSettings() {
    const {
        calculationMethod, setCalculationMethod,
        asrJuristic, setAsrJuristic,
        corrections, setCorrections
    } = useSettingsStore();

    return (
        <div className="settings-page prayer-settings">
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

            {/* Correction Settings */}
            <section className="settings-section">
                <h2 className="settings-section__title">⏱️ Koreksi Waktu (menit)</h2>
                <div className="settings-group-grid">
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
        </div>
    );
}
