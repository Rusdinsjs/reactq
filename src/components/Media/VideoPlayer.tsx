// Video Player Component

import { useRef, useState, useEffect } from 'react';
import './Media.css';

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    showControls?: boolean;
    onEnded?: () => void;
    className?: string;
}

export function VideoPlayer({
    src,
    autoPlay = false,
    loop = false,
    muted = true,
    showControls = true,
    onEnded,
    className = '',
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            onEnded?.();
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, [onEnded]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        video.currentTime = clickPosition * video.duration;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`video-player ${className}`}>
            <video
                ref={videoRef}
                src={src}
                className="video-player__video"
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                onClick={togglePlay}
            />

            {showControls && (
                <div className="video-player__controls">
                    <button className="video-player__btn" onClick={togglePlay}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>

                    <div className="video-player__progress" onClick={handleProgressClick}>
                        <div
                            className="video-player__progress-bar"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <span className="video-player__time">
                        {formatTime(videoRef.current?.currentTime ?? 0)} / {formatTime(duration)}
                    </span>
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;
