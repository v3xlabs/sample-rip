/* eslint-disable jsx-a11y/media-has-caption */
// @ts-nocheck
import { FC, useRef } from 'react';
import { FaDownload, FaPlay, FaPause } from 'react-icons/fa';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const SampleTray: FC<{ packId: string; sampleId: string }> = ({
    packId,
    sampleId,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { currentPackId, currentSampleId, isPlaying, playPause } = useAudioPlayer();
    const isCurrent = currentPackId === packId && currentSampleId === sampleId && isPlaying;
    const handlePlayPause = () => {
        if (audioRef.current) {
            playPause(packId, sampleId, audioRef.current);
        }
    };

    return (
        <li className="flex flex-wrap items-center gap-2 p-2 border-b border-neutral-200 hover:bg-neutral-300/10">
            <button
                className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500"
                onClick={handlePlayPause}
            >
                {isCurrent ? <FaPause /> : <FaPlay />}
            </button>
            <div className="flex-1">
                <h3 className="text-base">{sampleId}</h3>
            </div>
            <audio
                ref={audioRef}
                src={`https://github.com/v3xlabs/sample-rip/raw/master/samples/${packId}/${sampleId}`}
                controls
            />
            <div>
                <a
                    href={`https://github.com/v3xlabs/sample-rip/raw/master/samples/${packId}/${sampleId}`}
                    target="_blank"
                    className="btn !py-2 flex"
                >
                    <FaDownload />
                </a>
            </div>
        </li>
    );
};
