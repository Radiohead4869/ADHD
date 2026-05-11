import React, { useState, useEffect, useRef } from 'react';
import { Headphones, VolumeX, Volume2, Waves } from 'lucide-react';

export function WhiteNoisePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      const bufferSize = 2 * audioCtxRef.current.sampleRate;
      const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Let's create brown-ish noise for better ADHD focus
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for gain loss
      }

      const whiteNoise = audioCtxRef.current.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000; 

      const gainNode = audioCtxRef.current.createGain();
      gainNode.gain.value = volume;
      gainNodeRef.current = gainNode;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      
      whiteNoise.start(0);
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      initAudio();
      audioCtxRef.current?.resume();
    } else {
      audioCtxRef.current?.suspend();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-[var(--panel)] border-2 border-[var(--primary)] rounded-full p-2 flex items-center gap-3 shadow-[0_0_20px_rgba(255,143,107,0.2)] hover:shadow-[0_0_25px_rgba(255,143,107,0.4)] transition-shadow">
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[var(--primary)] text-white shadow-inner scale-105' : 'bg-[var(--bg-dark)] hover:bg-[var(--primary)] hover:text-white text-[var(--primary)]'}`}
          title="ADHD 专属专注背景音"
        >
          {isPlaying ? <Waves className="w-6 h-6 animate-pulse" /> : <Headphones className="w-6 h-6" />}
        </button>
        {isPlaying && (
          <div className="pr-4 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
            <VolumeX className="w-4 h-4 text-[var(--text-dim)]" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-[var(--primary)] text-[var(--primary)] cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-[var(--text-dim)]" />
          </div>
        )}
      </div>
    </div>
  );
}
