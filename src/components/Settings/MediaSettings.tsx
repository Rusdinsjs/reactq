import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { openImageFileDialog, openVideoFileDialog } from '../../services/tauriBridge';
import { convertFileSrc } from '@tauri-apps/api/core';
import type { SlideItem } from '../../types/settings.types';
import './Settings.css';

export function MediaSettings() {
    const {
        slides,
        setSlideSettings,
        runningText,
        setRunningTextSettings
    } = useSettingsStore();

    const [newRunningText, setNewRunningText] = useState('');

    // Helper to get display source
    const getFileSrc = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('blob:')) return path;
        try {
            return convertFileSrc(path);
        } catch {
            return path;
        }
    };

    // --- Slide Handlers ---

    const handleAddSlide = async (type: 'image' | 'video') => {
        let path: string | null = null;

        if (type === 'image') {
            path = await openImageFileDialog('Pilih Gambar Slide');
        } else {
            path = await openVideoFileDialog('Pilih Video Slide');
        }

        if (path) {
            const newSlide: SlideItem = {
                id: Date.now().toString(),
                type,
                path,
                duration: type === 'image' ? 10 : 30, // Default duration
                enabled: true
            };

            setSlideSettings({
                slides: [...slides.slides, newSlide]
            });
        }
    };

    const handleRemoveSlide = (id: string) => {
        setSlideSettings({
            slides: slides.slides.filter(s => s.id !== id)
        });
    };

    const handleUpdateSlide = (id: string, updates: Partial<SlideItem>) => {
        setSlideSettings({
            slides: slides.slides.map(s => s.id === id ? { ...s, ...updates } : s)
        });
    };

    const handleMoveSlide = (id: string, direction: 'up' | 'down') => {
        const index = slides.slides.findIndex(s => s.id === id);
        if (index === -1) return;

        const newSlides = [...slides.slides];
        if (direction === 'up' && index > 0) {
            [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
        } else if (direction === 'down' && index < newSlides.length - 1) {
            [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
        }

        setSlideSettings({ slides: newSlides });
    };

    // --- Running Text Handlers ---

    const handleAddRunningText = () => {
        if (!newRunningText.trim()) return;

        setRunningTextSettings({
            texts: [...runningText.texts, newRunningText.trim()]
        });
        setNewRunningText('');
    };

    const handleRemoveRunningText = (index: number) => {
        setRunningTextSettings({
            texts: runningText.texts.filter((_, i) => i !== index)
        });
    };

    const handleUpdateRunningText = (index: number, text: string) => {
        const newTexts = [...runningText.texts];
        newTexts[index] = text;
        setRunningTextSettings({ texts: newTexts });
    };

    return (
        <div className="settings-page media-settings">
            {/* --- SLIDES SECTION --- */}
            <section className="settings-section">
                <h2 className="settings-section__title">🖼️ Slide Gambar & Video</h2>

                <div className="settings-group">
                    <div className="settings-row" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={slides.enabled}
                                onChange={(e) => setSlideSettings({ enabled: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Aktifkan Slide</span>
                        </label>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="settings-btn settings-btn--secondary" onClick={() => handleAddSlide('image')}>
                                + Gambar
                            </button>
                            <button className="settings-btn settings-btn--secondary" onClick={() => handleAddSlide('video')}>
                                + Video
                            </button>
                        </div>
                    </div>

                    <div className="settings-group">
                        <label className="settings-label">
                            Interval Slide Gambar: {slides.interval} detik
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="60"
                            className="settings-range"
                            value={slides.interval}
                            onChange={(e) => setSlideSettings({ interval: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="slides-list">
                        {slides.slides.length === 0 ? (
                            <div className="empty-state">Belum ada slide. Tambahkan gambar atau video.</div>
                        ) : (
                            slides.slides.map((slide, index) => (
                                <div key={slide.id} className="slide-item">
                                    <div className="slide-item__preview">
                                        {slide.type === 'image' ? (
                                            <img src={getFileSrc(slide.path)} alt="Slide Preview" />
                                        ) : (
                                            <video
                                                src={getFileSrc(slide.path)}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                muted
                                                playsInline
                                            />
                                        )}
                                    </div>
                                    <div className="slide-item__info">
                                        <div className="slide-item__path" title={slide.path}>
                                            {slide.path.split(/[/\\]/).pop()}
                                        </div>
                                        <div className="slide-item__meta">
                                            <span className="badge">{slide.type === 'image' ? 'Gambar' : 'Video'}</span>
                                            {slide.type === 'video' && (
                                                <div className="duration-input-small">
                                                    <input
                                                        type="number"
                                                        value={slide.duration || 0}
                                                        onChange={(e) => handleUpdateSlide(slide.id, { duration: parseInt(e.target.value) })}
                                                        min="1"
                                                    /> det
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="slide-item__actions">
                                        <label className="settings-switch settings-switch--small">
                                            <input
                                                type="checkbox"
                                                checked={slide.enabled}
                                                onChange={(e) => handleUpdateSlide(slide.id, { enabled: e.target.checked })}
                                            />
                                            <span className="settings-switch__slider"></span>
                                        </label>
                                        <button className="icon-btn" onClick={() => handleMoveSlide(slide.id, 'up')} disabled={index === 0}>⬆️</button>
                                        <button className="icon-btn" onClick={() => handleMoveSlide(slide.id, 'down')} disabled={index === slides.slides.length - 1}>⬇️</button>
                                        <button className="icon-btn icon-btn--danger" onClick={() => handleRemoveSlide(slide.id)}>🗑️</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- RUNNING TEXT SECTION --- */}
            <section className="settings-section">
                <h2 className="settings-section__title">📜 Running Text</h2>

                <div className="settings-group">
                    <div className="settings-row" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={runningText.enabled}
                                onChange={(e) => setRunningTextSettings({ enabled: e.target.checked })}
                            />
                            <span className="settings-switch__slider"></span>
                            <span className="settings-switch__label">Aktifkan Running Text</span>
                        </label>
                    </div>

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

                    <div className="running-text-manager">
                        <div className="running-text-input-group">
                            <input
                                type="text"
                                className="settings-input"
                                placeholder="Tambah teks baru..."
                                value={newRunningText}
                                onChange={(e) => setNewRunningText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRunningText()}
                            />
                            <button className="settings-btn" onClick={handleAddRunningText}>+ Tambah</button>
                        </div>

                        <div className="text-list">
                            {runningText.texts.map((text, index) => (
                                <div key={index} className="text-item">
                                    <input
                                        type="text"
                                        className="settings-input text-item__input"
                                        value={text}
                                        onChange={(e) => handleUpdateRunningText(index, e.target.value)}
                                    />
                                    <button
                                        className="icon-btn icon-btn--danger"
                                        onClick={() => handleRemoveRunningText(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
