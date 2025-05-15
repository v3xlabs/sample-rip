// @ts-nocheck
import React, { FC, useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface WaveformProperties {
    data: number[];
    progress?: number;
    height?: number;
    barWidth?: number;
    onSeek?: (position: number) => void;
    packId?: string;
    sampleId?: string;
}

const Waveform: FC<WaveformProperties> = ({
    data,
    height = 40,
    barWidth = 2,
    progress = 0,
    onSeek,
    packId,
    sampleId,
}) => {
    if (!data || data.length === 0) return <></>;
    
    const { seek, playPause } = useAudioPlayer();
    const audioRef = useRef<HTMLAudioElement>(null);
    
    // Create an audio element if we don't already have one in the DOM
    useEffect(() => {
        if (packId && sampleId && !audioRef.current) {
            // Create a new audio element
            audioRef.current = new Audio();
            audioRef.current.src = `https://raw.githubusercontent.com/v3xlabs/sample-rip/refs/heads/master/samples/${packId}/${sampleId}`;
            audioRef.current.preload = 'metadata';
        }
    }, [packId, sampleId]);
    
    const total = data.length;
    const playedBars = Math.floor(progress * total);
    
    const handleInteraction = (
        event: React.MouseEvent | React.KeyboardEvent
    ) => {
        if (!packId || !sampleId) return;
        
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();
        
        // Calculate position based on click location
        const x = 
            'clientX' in event ? event.clientX - rect.left : rect.width / 2;
        
        // Calculate total width (accounting for bar width and spacing)
        const totalBarSpace = total * (barWidth + 1) - 1;
        
        // Get position as a ratio (0-1)
        const position = Math.max(0, Math.min(1, x / totalBarSpace));
        
        // First try to find existing audio element in the DOM
        let audioElement = document.querySelector(
            `audio[src*="/samples/${packId}/${sampleId}"]`
        );
        
        // If no audio element found in DOM, use our reference
        if (!audioElement && audioRef.current) {
            audioElement = audioRef.current;
        }
        
        // If we still don't have an audio element, create a new one
        if (!audioElement) {
            audioElement = new Audio();
            audioElement.src = `https://raw.githubusercontent.com/v3xlabs/sample-rip/refs/heads/master/samples/${packId}/${sampleId}`;
            audioElement.preload = 'metadata';
            audioRef.current = audioElement;
        }
            
        // Make sure the audio is loaded before we try to seek/play
        const loadAndPlay = () => {
            if (audioElement) {
                // Set the current time based on the click position
                audioElement.currentTime = position * (audioElement.duration || 0);
                
                // Then play from that position
                playPause(packId, sampleId, audioElement);
            }
        };
        
        // If the audio is already loaded, play immediately
        if (audioElement.readyState >= 2) {
            loadAndPlay();
        } else {
            // Otherwise, wait for metadata to load
            audioElement.addEventListener('loadedmetadata', loadAndPlay, { once: true });
            // Force load if not already loading
            if (audioElement.readyState === 0) {
                audioElement.load();
            }
        }
        
        // Use the callback if provided
        if (onSeek) {
            onSeek(position);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleInteraction(event);
        }
    };

    // Create a container with the exact width of our bars + spacing
    const containerWidth = total * (barWidth + 1) - 1;

    return (
        <div
            className="flex items-end overflow-hidden relative cursor-pointer"
            style={{ 
                height,
                width: containerWidth,
                maxWidth: '100%'
            }}
            onClick={handleInteraction}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={progress}
            tabIndex={0}
        >
            {data.map((value, index) => {
                let colorClass = 'bg-neutral-400';

                if (index < playedBars) {
                    colorClass = 'bg-neutral-800';
                } else if (index === playedBars) {
                    colorClass = 'bg-blue-500';
                }

                return (
                    <div
                        key={index}
                        className="relative"
                        style={{
                            width: barWidth,
                            height: '100%',
                            marginRight: index < total - 1 ? 1 : 0,
                        }}
                    >
                        <div
                            className={colorClass}
                            style={{
                                width: '100%',
                                height: `${value * height}px`,
                                position: 'absolute',
                                bottom: 0,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Waveform;
