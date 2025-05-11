// @ts-nocheck
import React, { FC } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { PACKS } from '../config';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

const AudioPlayerOverlay: FC = () => {
    const { currentPackId, currentSampleId, isPlaying, playPause, duration, currentTime, seek, setVolume, volume } = useAudioPlayer();

    if (!currentPackId || !currentSampleId) return null;

    const pack = PACKS[currentPackId];

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleToggle = () => {
        const audioEl = document.querySelector<HTMLAudioElement>(
            `audio[src*="/samples/${currentPackId}/${currentSampleId}"]`
        );
        if (audioEl) {
            playPause(currentPackId, currentSampleId, audioEl);
        }
    };

    return (
        <div className="hidden lg:flex fixed bottom-0 left-0 right-0 bg-white border-t p-4 items-center gap-4">
            {pack.cover && (
                <img
                    src={pack.cover}
                    alt={pack.name}
                    className="w-16 h-16 object-cover rounded"
                />
            )}
            <div className="flex-1 flex flex-col space-y-1">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{pack.name}</span>
                    <span className="text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="text-sm text-neutral-600">{currentSampleId}</div>
                <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={currentTime}
                    onChange={e => seek(e.target.valueAsNumber)}
                    className="w-full"
                />
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
                    onChange={e => setVolume(e.target.valueAsNumber)}
                    className="w-24"
                />
            </div>
        </div>
    );
};

export default AudioPlayerOverlay;
 