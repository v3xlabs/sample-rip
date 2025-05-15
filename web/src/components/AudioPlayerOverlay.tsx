// @ts-nocheck
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { FaPause, FaPlay, FaVolumeUp } from 'react-icons/fa';

import { PACKS } from '../config';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import Waveform from './Waveform';

const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;
};

const AudioPlayerOverlay: FC = () => {
    const {
        currentPackId,
        currentSampleId,
        isPlaying,
        playPause,
        duration,
        currentTime,
        seek,
        setVolume,
        volume,
    } = useAudioPlayer();

    const [waveformData, setWaveformData] = useState<number[]>([]);

    // Load actual waveform data from JSON
    useEffect(() => {
        if (currentPackId && currentSampleId) {
            let cancelled = false;

            fetch(`/waveforms/${currentPackId}/${currentSampleId}.json`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Waveform data not available');
                    }

                    return response.json();
                })
                .then((data: number[]) => {
                    if (!cancelled) setWaveformData(data);
                })
                .catch(() => {
                    // Fallback to generating random data if fetch fails
                    if (!cancelled) {
                        const sampleCount = 100;
                        const fallbackData = Array.from(
                            { length: sampleCount },
                            () => Math.random() * 0.8 + 0.2
                        );

                        setWaveformData(fallbackData);
                    }
                });

            return () => {
                cancelled = true;
            };
        }
    }, [currentPackId, currentSampleId]);

    if (!currentPackId || !currentSampleId) return <></>;

    const pack = PACKS[currentPackId];

    const handleToggle = () => {
        // Using document is OK in this case as we're in a browser environment
        const audioElement = document.querySelector(
            `audio[src*="/samples/${currentPackId}/${currentSampleId}"]`
        );

        if (audioElement) {
            playPause(currentPackId, currentSampleId, audioElement);
        }
    };

    const handleSeek = (position: number) => {
        if (duration) {
            seek(position * duration);
        }
    };

    return (
        <div className="hidden lg:flex fixed bottom-0 left-0 right-0 bg-white border-t p-4 items-center gap-4">
            {pack.cover && (
                <button onClick={handleToggle} className="relative">
                    <img
                        src={pack.cover}
                        alt={pack.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                    <div
                        className={classNames(
                            'absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/10',
                            {
                                'opacity-0': isPlaying,
                            }
                        )}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </div>
                </button>
            )}
            <div className="flex-1 flex flex-col space-y-1">
                <div className="flex justify-start gap-4 items-center text-sm">
                    <div className="flex flex-col">
                        <div className="font-semibold">{currentSampleId}</div>
                        <span className="text-sm text-neutral-600">
                            {pack.name}
                        </span>
                    </div>

                    {waveformData.length > 0 ? (
                        <Waveform
                            data={waveformData}
                            progress={duration ? currentTime / duration : 0}
                            onSeek={handleSeek}
                            height={40}
                            packId={currentPackId}
                            sampleId={currentSampleId}
                        />
                    ) : (
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            step={0.01}
                            value={currentTime}
                            onChange={(event) =>
                                seek(event.target.valueAsNumber)
                            }
                            className="w-full"
                        />
                    )}

                    <span className="text-xs">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            </div>
            <button
                onClick={handleToggle}
                className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500"
            >
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <div className="flex items-center gap-2">
                <FaVolumeUp />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(event) => setVolume(event.target.valueAsNumber)}
                    className="w-24"
                />
            </div>
        </div>
    );
};

export default AudioPlayerOverlay;
