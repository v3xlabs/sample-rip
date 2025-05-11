/* eslint-disable jsx-a11y/media-has-caption */
// @ts-nocheck
import { FC, useRef, useState, useEffect } from 'react';
import { FaDownload, FaPlay, FaPause } from 'react-icons/fa';
import Waveform from './Waveform';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const SampleTray: FC<{ packId: string; sampleId: string }> = ({
    packId,
    sampleId,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { currentPackId, currentSampleId, isPlaying, playPause, currentTime, duration } = useAudioPlayer();
    const isCurrent = currentPackId === packId && currentSampleId === sampleId && isPlaying;
    // compute waveform progress for this sample
    const progress = isCurrent && duration > 0 ? currentTime / duration : 0;
    const handlePlayPause = () => {
        if (audioRef.current) {
            playPause(packId, sampleId, audioRef.current);
        }
    };

    // Load waveform only when this sample is active
    const [waveform, setWaveform] = useState<number[]>([]);
    useEffect(() => {
        if (!isCurrent) {
            setWaveform([]);
            return;
        }
        let cancelled = false;
        fetch(`/waveforms/${packId}/${sampleId}.json`)
            .then((res) => res.json())
            .then((data: number[]) => { if (!cancelled) setWaveform(data); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [isCurrent, packId, sampleId]);

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
                <Waveform data={waveform} progress={progress} />
            </div>
            <audio
                ref={audioRef}
                src={`https://github.com/v3xlabs/sample-rip/raw/master/samples/${packId}/${sampleId}`}
                preload="metadata"
                className="sr-only"
                aria-hidden="true"
            />
            <div className="flex items-center gap-2">
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
