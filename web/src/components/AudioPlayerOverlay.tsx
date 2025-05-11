// @ts-nocheck
import React, { FC } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { PACKS } from '../config';
import { FaPlay, FaPause } from 'react-icons/fa';

const AudioPlayerOverlay: FC = () => {
    const { currentPackId, currentSampleId, isPlaying, playPause } = useAudioPlayer();

    if (!currentPackId || !currentSampleId) return null;

    const pack = PACKS[currentPackId];

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
            <div className="flex-1">
                <div className="font-semibold">{pack.name}</div>
                <div className="text-sm">{currentSampleId}</div>
            </div>
            <button
                onClick={handleToggle}
                className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500"
            >
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
        </div>
    );
};

export default AudioPlayerOverlay;
 