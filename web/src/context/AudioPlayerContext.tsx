// @ts-nocheck
import React, { createContext, useContext, useState, useRef, ReactNode, FC } from 'react';

interface AudioPlayerContextType {
    currentPackId: string | null;
    currentSampleId: string | null;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    playPause: (packId: string, sampleId: string, audioEl: HTMLAudioElement) => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
    currentPackId: null,
    currentSampleId: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    playPause: () => {},
    seek: () => {},
    setVolume: () => {},
});

export const AudioPlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentPackId, setCurrentPackId] = useState<string | null>(null);
    const [currentSampleId, setCurrentSampleId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolumeState] = useState<number>(1);

    const playPause = (packId: string, sampleId: string, audioEl: HTMLAudioElement) => {
        if (currentPackId === packId && currentSampleId === sampleId && audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = audioEl;
            audioRef.current.play();
            audioRef.current.volume = volume;
            audioRef.current.addEventListener('loadedmetadata', () => setDuration(audioRef.current!.duration));
            audioRef.current.addEventListener('timeupdate', () => setCurrentTime(audioRef.current!.currentTime));
            setCurrentPackId(packId);
            setCurrentSampleId(sampleId);
            setIsPlaying(true);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (vol: number) => {
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
        setVolumeState(vol);
    };

    return (
        <AudioPlayerContext.Provider value={{ currentPackId, currentSampleId, isPlaying, duration, currentTime, volume, playPause, seek, setVolume }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext); 