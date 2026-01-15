import React, { useEffect, useRef, useState } from 'react';
import { SceneData, SceneOption } from '../types';
import { TRANSLATIONS, MOOD_TRACKS } from '../constants';
import { Volume2, VolumeX, Image as ImageIcon } from 'lucide-react';

interface GameScreenProps {
  scene: SceneData;
  isLoading: boolean;
  onOptionSelect: (option: SceneOption) => void;
  language: string;
}

// --- AUDIO UTILITIES FOR NARRATION ---

// Convert Base64 Raw PCM (24kHz, Mono) to AudioBuffer
const pcmToAudioBuffer = (base64: string, ctx: AudioContext): AudioBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  // Gemini sends Int16 raw PCM
  const int16 = new Int16Array(len / 2);
  const dataView = new DataView(new ArrayBuffer(len));
  
  for (let i = 0; i < len; i++) {
    dataView.setUint8(i, binaryString.charCodeAt(i));
  }
  
  // Create float32 array for Web Audio
  const float32 = new Float32Array(len / 2);
  for (let i = 0; i < len / 2; i++) {
    const val = dataView.getInt16(i * 2, true); 
    float32[i] = val / 32768.0;
  }

  const buffer = ctx.createBuffer(1, float32.length, 24000); 
  buffer.copyToChannel(float32, 0);
  return buffer;
};

// --- COMPONENT ---

const GameScreen: React.FC<GameScreenProps> = ({ scene, isLoading, onOptionSelect, language }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Narration (Voice)
  const voiceCtxRef = useRef<AudioContext | null>(null);
  const voiceSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const voiceGainRef = useRef<GainNode | null>(null);

  // Background Music
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS['English'].ui;

  // Initialize Voice Context
  useEffect(() => {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    voiceCtxRef.current = new AudioCtor();
    voiceGainRef.current = voiceCtxRef.current.createGain();
    voiceGainRef.current.connect(voiceCtxRef.current.destination);
    
    // Initialize Music Player
    musicRef.current = new Audio();
    musicRef.current.loop = true;
    musicRef.current.volume = 0.2; // Background volume

    return () => { 
      voiceCtxRef.current?.close(); 
      musicRef.current?.pause();
      musicRef.current = null;
    };
  }, []);

  // Handle Music Changes
  useEffect(() => {
    if (!musicRef.current) return;
    
    const mood = scene.musicConfig.mood;
    const trackUrl = MOOD_TRACKS[mood] || MOOD_TRACKS['epic'];

    // Check if track changed (avoid restarting if same mood)
    // We decodeURIComponent because audio.src might return encoded chars
    if (musicRef.current.src !== trackUrl) {
      musicRef.current.src = trackUrl;
      if (audioEnabled) {
         musicRef.current.play().catch(e => console.warn("Autoplay blocked", e));
      }
    }
  }, [scene.musicConfig.mood, audioEnabled]);

  // Play Narration using Correct Decoding
  const playNarration = async (base64Data: string) => {
    if (!audioEnabled || !voiceCtxRef.current || !voiceGainRef.current) return;
    const ctx = voiceCtxRef.current;
    
    // Resume if suspended
    if (ctx.state === 'suspended') await ctx.resume();

    // Stop previous
    if (voiceSourceRef.current) {
      try { voiceSourceRef.current.stop(); } catch(e) {}
    }

    try {
      const buffer = pcmToAudioBuffer(base64Data, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(voiceGainRef.current);
      
      voiceSourceRef.current = source;
      source.start(0);
      setIsPlayingNarration(true);
      
      // Duck music while speaking
      if (musicRef.current) {
        musicRef.current.volume = 0.05;
      }

      source.onended = () => {
        setIsPlayingNarration(false);
        // Restore music volume
        if (musicRef.current) {
          musicRef.current.volume = 0.2;
        }
      };
    } catch (e) {
      console.error("Audio playback error", e);
      setIsPlayingNarration(false);
    }
  };

  // Text Typewriter + Audio Trigger
  useEffect(() => {
    setDisplayedText('');
    setShowOptions(false);
    let index = 0;
    const fullText = (scene.dialogue ? `"${scene.dialogue}"\n\n` : '') + scene.narrative;
    
    // Trigger Audio
    if (scene.audioBase64) {
      playNarration(scene.audioBase64);
    }

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index === fullText.length) {
        clearInterval(intervalId);
        setShowOptions(true);
      }
    }, 25); 

    return () => {
      clearInterval(intervalId);
      if (voiceSourceRef.current) {
        try { voiceSourceRef.current.stop(); } catch(e){}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]); 

  const stopNarration = () => {
    if (voiceSourceRef.current) {
       try { voiceSourceRef.current.stop(); } catch(e){}
    }
    setIsPlayingNarration(false);
    if (musicRef.current) musicRef.current.volume = 0.2;
  };

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    
    if (musicRef.current) {
      if (newState) {
        musicRef.current.play().catch(e => console.warn(e));
      } else {
        musicRef.current.pause();
      }
    }

    if (!newState && isPlayingNarration) stopNarration();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans text-slate-200">
      
      {/* Loading Overlay (Global) */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-indigo-200 font-title animate-pulse">{t.loading}</p>
        </div>
      )}

      {/* LEFT (Desktop) / TOP (Mobile) - VISUALS */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-black flex-shrink-0">
        {scene.imageBase64 ? (
          <img 
            src={`data:image/png;base64,${scene.imageBase64}`} 
            alt="Scene" 
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
            <ImageIcon size={64} className="opacity-20" />
          </div>
        )}
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/50 pointer-events-none" />
      </div>

      {/* RIGHT (Desktop) / BOTTOM (Mobile) - NARRATIVE */}
      <div className="relative w-full md:w-1/2 h-[60vh] md:h-screen flex flex-col bg-slate-950 border-t md:border-t-0 md:border-l border-slate-900 shadow-2xl z-10">
        
        {/* Header: Controls & Status */}
        <div className="flex-shrink-0 flex justify-end items-center p-4 md:p-6 border-b border-slate-900 bg-slate-950/50">
           <button 
             onClick={toggleAudio}
             className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-indigo-300 transition-colors"
             title={audioEnabled ? "Mute Audio" : "Enable Audio"}
           >
             {audioEnabled ? <Volume2 size={20} className={isPlayingNarration ? "text-indigo-400 animate-pulse" : ""} /> : <VolumeX size={20} />}
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          <div className="max-w-xl mx-auto space-y-8">
            
            {/* Story Text */}
            <div className="font-serif text-lg md:text-xl leading-relaxed text-slate-300 whitespace-pre-wrap">
               {displayedText}
               <span className="animate-pulse inline-block w-2 h-5 bg-indigo-500 ml-1 align-middle opacity-70"></span>
            </div>

            {/* Choices */}
            <div className={`space-y-3 transition-all duration-700 ${showOptions && !isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              {scene.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onOptionSelect(option)}
                  className="w-full group relative p-4 md:p-5 text-left rounded-xl bg-slate-900 hover:bg-indigo-950/20 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                     <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors flex-shrink-0" />
                     <span className="text-base font-medium text-slate-400 group-hover:text-indigo-100 transition-colors">
                       {option.text}
                     </span>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GameScreen;