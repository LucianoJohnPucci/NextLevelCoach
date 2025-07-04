
import { useState, useEffect, useRef } from "react";

type AudioOptions = {
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
};

export const useAudio = (audioSrc?: string, options: AudioOptions = {}) => {
  const { autoplay = false, loop = false, volume = 1 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioSrc) return;
    
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    
    audio.autoplay = autoplay;
    audio.loop = loop;
    audio.volume = volume;
    
    const handleCanPlay = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setError("Failed to load audio");
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError as EventListener);
    
    if (autoplay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay was prevented. User interaction required to play audio.", error);
          setIsPlaying(false);
        });
      }
    }

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError as EventListener);
      audioRef.current = null;
    };
  }, [audioSrc, autoplay, loop, volume]);

  const play = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  const playAudio = (src: string) => {
    const audio = new Audio(src);
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  };

  return {
    isPlaying,
    isLoaded,
    error,
    play,
    pause,
    toggle,
    setVolume,
    playAudio
  };
};
