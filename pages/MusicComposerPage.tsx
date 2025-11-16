import { useState, useRef, useEffect } from "react";
import { BeatPad } from "@/components/BeatPad";
import { PlaybackControls } from "@/components/PlaybackControls";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { SequenceDisplay } from "@/components/SequenceDisplay";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type InstrumentType =
  | "drum"
  | "bass"
  | "melody"
  | "synth"
  | "guitar"
  | "violin"
  | "flute";

interface Sound {
  id: number;
  type: InstrumentType;
  name: string;
  frequency: number;
}

const MusicComposerPage = () => {
  const navigate = useNavigate();
  const [selectedInstrument, setSelectedInstrument] =
    useState<InstrumentType>("drum");
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<Sound[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sequenceIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎧 Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    analyserRef.current.connect(audioContextRef.current.destination);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 🎵 Instrument sounds with different frequencies
  const sounds: Record<InstrumentType, { name: string; frequency: number }[]> = {
    drum: [
      { name: "Kick", frequency: 60 },
      { name: "Snare", frequency: 200 },
      { name: "Hi-Hat", frequency: 800 },
      { name: "Tom", frequency: 150 },
      { name: "Crash", frequency: 500 },
    ],
    bass: [
      { name: "Low", frequency: 110 },
      { name: "Mid", frequency: 165 },
      { name: "High", frequency: 220 },
      { name: "Deep", frequency: 82 },
      { name: "Groove", frequency: 140 },
    ],
    melody: [
      { name: "C", frequency: 261.63 },
      { name: "E", frequency: 329.63 },
      { name: "G", frequency: 392.0 },
      { name: "A", frequency: 440.0 },
      { name: "B", frequency: 493.88 },
    ],
    synth: [
      { name: "Pad 1", frequency: 523.25 },
      { name: "Pad 2", frequency: 587.33 },
      { name: "Pad 3", frequency: 659.25 },
      { name: "Lead", frequency: 783.99 },
      { name: "Pluck", frequency: 880.0 },
    ],
    guitar: [
      { name: "Chord 1", frequency: 196.0 },
      { name: "Chord 2", frequency: 220.0 },
      { name: "Chord 3", frequency: 246.94 },
      { name: "Riff", frequency: 293.66 },
      { name: "Slide", frequency: 329.63 },
    ],
    violin: [
      { name: "String 1", frequency: 440.0 },
      { name: "String 2", frequency: 493.88 },
      { name: "String 3", frequency: 523.25 },
      { name: "String 4", frequency: 587.33 },
      { name: "Vibrato", frequency: 659.25 },
    ],
    flute: [
      { name: "Note 1", frequency: 261.63 },
      { name: "Note 2", frequency: 293.66 },
      { name: "Note 3", frequency: 329.63 },
      { name: "Note 4", frequency: 392.0 },
      { name: "Trill", frequency: 440.0 },
    ],
  };

  // 🔊 Play tone
  const playSound = (
    frequency: number,
    duration: number = 0.3,
    type: InstrumentType = "drum"
  ) => {
    if (!audioContextRef.current || !analyserRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(analyserRef.current);

    oscillator.frequency.value = frequency;

    const waveforms: Record<InstrumentType, OscillatorType> = {
      drum: "triangle",
      bass: "sine",
      melody: "sine",
      synth: "square",
      guitar: "sawtooth",
      violin: "triangle",
      flute: "sine",
    };

    oscillator.type = waveforms[type];
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  // 🪘 Handle beat pad click
  const handlePadClick = (soundIndex: number) => {
    const sound = sounds[selectedInstrument][soundIndex];
    setActivePad(soundIndex);
    playSound(sound.frequency, 0.3, selectedInstrument);

    const newSound: Sound = {
      id: Date.now(),
      type: selectedInstrument,
      name: sound.name,
      frequency: sound.frequency,
    };

    setSequence((prev) => [...prev, newSound]);
    toast.success(`Added ${selectedInstrument} - ${sound.name}`);

    // Reset active pad after a short delay
    setTimeout(() => setActivePad(null), 200);
  };

  // ▶️ Play sequence loop
  const handlePlay = () => {
    if (sequence.length === 0) {
      toast.error("Add some beats first!");
      return;
    }

    setIsPlaying(true);
    sequenceIndexRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (sequenceIndexRef.current >= sequence.length) {
        sequenceIndexRef.current = 0;
      }

      const sound = sequence[sequenceIndexRef.current];
      playSound(sound.frequency, 0.3, sound.type);
      sequenceIndexRef.current++;
    }, 300);
  };

  // ⏸ Pause
  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 🧹 Clear sequence
  const handleClear = () => {
    setSequence([]);
    handlePause();
    toast.info("Sequence cleared");
  };

  const handleDeleteSound = (id: number) => {
    setSequence((prev) => prev.filter((sound) => sound.id !== id));
    toast.success("Sound removed");
  };

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center p-6 transition-all duration-700
        bg-gradient-to-b from-pink-200 via-purple-200 to-pink-300
        dark:from-[#1b002f] dark:via-[#290a4c] dark:to-[#12001c]
        text-black dark:text-white
      `}
    >
      {/* 🔙 Back Button */}
      <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/20 rounded-lg transition text-black dark:text-white"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="max-w-5xl w-full space-y-8">
        {/* 🎵 Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
            Music Composer
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Select an instrument and tap pads to create your own beat
          </p>
        </div>

        {/* 🎸 Instrument Selector */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {(Object.keys(sounds) as InstrumentType[]).map((instrument) => (
            <button
              key={instrument}
              onClick={() => setSelectedInstrument(instrument)}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
                selectedInstrument === instrument
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
                  : "bg-white/50 hover:bg-white/70 text-gray-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-gray-200"
              }`}
            >
              {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
            </button>
          ))}
        </div>

        {/* 🟪 Beat Pads */}
        <div className="bg-white/50 dark:bg-white/5 p-6 rounded-2xl shadow-xl border border-white/30 dark:border-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {sounds[selectedInstrument].map((sound, index) => (
              <button
                key={index}
                onClick={() => handlePadClick(index)}
                className={`h-28 rounded-xl font-bold text-lg transition-all duration-200 shadow-md ${
                  activePad === index
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-105"
                    : "bg-gradient-to-r from-pink-300 to-purple-300 text-black dark:from-pink-800 dark:to-purple-800 dark:text-white hover:scale-105"
                }`}
              >
                {sound.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🔊 Visualizer */}
        <AudioVisualizer
          isPlaying={isPlaying}
          analyserNode={analyserRef.current}
        />

        {/* ⏯ Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onClear={handleClear}
        />

        {/* 🎶 Sequence */}
        <SequenceDisplay sequence={sequence} onDelete={handleDeleteSound} />
      </div>
    </div>
  );
};

export default MusicComposerPage;
