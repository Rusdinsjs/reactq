// Audio Visualizer Component

import './Audio.css';

interface AudioVisualizerProps {
    isPlaying?: boolean;
    barCount?: number;
    className?: string;
}

export function AudioVisualizer({
    isPlaying = true,
    barCount = 8,
    className = '',
}: AudioVisualizerProps) {
    return (
        <div
            className={`audio-visualizer ${isPlaying ? '' : 'audio-visualizer--paused'} ${className}`}
        >
            {Array.from({ length: barCount }).map((_, i) => (
                <div
                    key={i}
                    className="audio-visualizer__bar"
                    style={{ animationDelay: `${(i * 0.1) % 0.5}s` }}
                />
            ))}
        </div>
    );
}

export default AudioVisualizer;
