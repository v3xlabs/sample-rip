// @ts-nocheck
import React, { createContext, useContext, useState, useRef, ReactNode, FC } from 'react';

interface AudioPlayerContextType {
    currentPackId: string | null;
    currentSampleId: string | null;
    isPlaying: boolean;
    playPause: (packId: string, sampleId: string, audioEl: HTMLAudioElement) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
    currentPackId: null,
    currentSampleId: null,
    isPlaying: false,
    playPause: () => {},
});

export const AudioPlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentPackId, setCurrentPackId] = useState<string | null>(null);
    const [currentSampleId, setCurrentSampleId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
            setCurrentPackId(packId);
            setCurrentSampleId(sampleId);
            setIsPlaying(true);
        }
    };

    return (
        <AudioPlayerContext.Provider value={{ currentPackId, currentSampleId, isPlaying, playPause }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext); 