"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";

interface AudioContextType {
  musicPlaying: boolean;
  audioInitialized: boolean;
  toggleMusic: () => void;
  initializeAudio: (play: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("hasVisited")) {
      setAudioInitialized(true);
    }
  }, []);

  const initializeAudio = (play: boolean) => {
    setAudioInitialized(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true");
    }

    if (play && audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch((e) => console.error("Audio play failed:", e));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.volume = 0.6;
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch((e) => console.error("Audio play failed:", e));
    }
  };

  return (
    <AudioContext.Provider value={{ musicPlaying, audioInitialized, toggleMusic, initializeAudio }}>
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
