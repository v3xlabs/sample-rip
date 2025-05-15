/* eslint-disable jsx-a11y/media-has-caption, unicorn/prevent-abbreviations, padding-line-between-statements, prettier/prettier */
// @ts-nocheck
/* global HTMLAudioElement HTMLDivElement HTMLSpanElement */
import { FC, useEffect, useRef, useState } from 'react';
import { FaDownload, FaPause, FaPlay } from 'react-icons/fa';

import { useAudioPlayer } from '../context/AudioPlayerContext';
import Waveform from './Waveform';

export const SampleTray: FC<{
    packId: string;
    sampleId: string;
    license: string;
}> = ({ packId, sampleId, license }) => {
    const audioReference = useRef<HTMLAudioElement | null>(null);
    const {
        currentPackId,
        currentSampleId,
        isPlaying,
        playPause,
        currentTime,
        duration,
    } = useAudioPlayer();
    const isCurrent =
        currentPackId === packId && currentSampleId === sampleId && isPlaying;

    const handlePlayPause = () => {
        if (audioReference.current) {
            playPause(packId, sampleId, audioReference.current);
        }
    };

    // compute waveform progress for this sample
    const progress =
        currentPackId === packId && currentSampleId === sampleId && duration > 0
            ? currentTime / duration
            : 0;

    // Load waveform data from JSON
    const [waveform, setWaveform] = useState<number[]>([]);

    useEffect(() => {
        let cancelled = false;

        fetch(`/waveforms/${packId}/${sampleId}.json`)
            .then((response) => response.json())
            .then((data: number[]) => {
                if (!cancelled) setWaveform(data);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [packId, sampleId]);

    // hover state to trigger scroll
    const [hovering, setHovering] = useState(false);
    const shouldScroll = hovering || isCurrent;

    // refs and state for dynamic scrolling of overflowing title
    const titleContainerRef = useRef<HTMLDivElement | null>(null);
    const titleTextRef = useRef<HTMLSpanElement | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [scrollDistance, setScrollDistance] = useState(0);
    const [scrollDuration, setScrollDuration] = useState(0);

    // measure overflow and calculate scrolling parameters
    useEffect(() => {
        if (titleContainerRef.current && titleTextRef.current) {
            const containerWidth = titleContainerRef.current.clientWidth;
            const textWidth = titleTextRef.current.scrollWidth;
            const diff = textWidth - containerWidth;
            if (diff > 0) {
                setIsOverflowing(true);
                setScrollDistance(diff);
                const speed = 50; // px per second
                setScrollDuration(diff / speed);
            } else {
                setIsOverflowing(false);
            }
        }
    }, [sampleId]);

    return (
        <tr className="border-b border-neutral-200 hover:bg-neutral-300/10 flex flex-col md:table-row">
            <td className="p-2 flex items-center gap-2 w-16">
                <button
                    className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-500"
                    onClick={handlePlayPause}
                >
                    {isCurrent ? <FaPause /> : <FaPlay />}
                </button>
                <audio
                    ref={audioReference}
                    src={`https://raw.githubusercontent.com/v3xlabs/sample-rip/refs/heads/master/samples/${packId}/${sampleId}`}
                    preload="none"
                    className="sr-only"
                    aria-hidden="true"
                />
            </td>
            <td
                className="p-2 overflow-hidden whitespace-nowrap"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <div
                    ref={titleContainerRef}
                    className="overflow-hidden whitespace-nowrap flex-shrink w-screen max-w-[320px]"
                >
                    <span
                        ref={titleTextRef}
                        className="inline-block"
                        style={{
                            transition: shouldScroll && isOverflowing
                                ? `transform ${scrollDuration}s linear`
                                : 'none',
                            transform: shouldScroll && isOverflowing
                                ? `translateX(-${scrollDistance}px)`
                                : 'translateX(0)',
                        }}
                    >
                        {sampleId}
                    </span>
                </div>
            </td>
            <td className="p-2 w-full">
                <Waveform 
                    data={waveform} 
                    progress={progress} 
                    packId={packId}
                    sampleId={sampleId}
                />
            </td>
            <td className="p-2 whitespace-nowrap text-sm">
                {license}
            </td>
            <td className="p-2 flex justify-end whitespace-nowrap">
                <a
                    href={`https://raw.githubusercontent.com/v3xlabs/sample-rip/refs/heads/master/samples/${packId}/${sampleId}.wav`}
                    target="_blank"
                    className="btn !py-2 flex w-fit"
                >
                    <FaDownload />
                </a>
            </td>
        </tr>
    );
};
