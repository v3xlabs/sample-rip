// @ts-nocheck
import React, {
    createContext,
    FC,
    ReactNode,
    useContext,
    useRef,
    useState,
} from 'react';

interface AudioPlayerContextType {
    currentPackId: string | null;
    currentSampleId: string | null;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    playPause: (
        packId: string,
        sampleId: string,
        audioElement: HTMLAudioElement
    ) => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
    currentPackId: null,
    currentSampleId: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 0.5,
    playPause: () => {},
    seek: () => {},
    setVolume: () => {},
});

export const AudioPlayerProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const audioReference = useRef<HTMLAudioElement | null>(null);
    const [currentPackId, setCurrentPackId] = useState<string | null>(null);
    const [currentSampleId, setCurrentSampleId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolumeState] = useState<number>(0.35);

    const playPause = (
        packId: string,
        sampleId: string,
        audioElement: HTMLAudioElement
    ) => {
        if (
            currentPackId === packId &&
            currentSampleId === sampleId &&
            audioReference.current
        ) {
            if (isPlaying) {
                audioReference.current.pause();
            } else {
                audioReference.current.play();
            }

            setIsPlaying(!isPlaying);
        } else {
            // Pause any existing audio
            if (audioReference.current) {
                audioReference.current.pause();
            }

            // Start new audio element
            audioReference.current = audioElement;
            // Reset time and duration
            setCurrentTime(0);
            setDuration(0);
            // Set volume
            audioElement.volume = volume;
            // Listen for metadata to get duration
            const onLoaded = () => setDuration(audioElement.duration);

            audioElement.addEventListener('loadedmetadata', onLoaded);
            // Listen for time updates
            const onTime = () => setCurrentTime(audioElement.currentTime);

            audioElement.addEventListener('timeupdate', onTime);
            // Listen for ended event to reset play state and time when audio finishes
            const onEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
                audioElement.currentTime = 0;
            };

            audioElement.addEventListener('ended', onEnded);

            // Fallback: if metadata already loaded
            if (!isNaN(audioElement.duration) && audioElement.duration > 0) {
                setDuration(audioElement.duration);
            }

            // Play
            audioElement.play();
            setCurrentPackId(packId);
            setCurrentSampleId(sampleId);
            setIsPlaying(true);
        }
    };

    const seek = (time: number) => {
        if (audioReference.current) {
            audioReference.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (vol: number) => {
        if (audioReference.current) {
            audioReference.current.volume = vol;
        }

        setVolumeState(vol);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                currentPackId,
                currentSampleId,
                isPlaying,
                duration,
                currentTime,
                volume,
                playPause,
                seek,
                setVolume,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
