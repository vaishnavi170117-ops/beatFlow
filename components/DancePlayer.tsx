import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ArrowLeft } from "lucide-react";
import Dancer from "./Dancer";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

import choreo_hiphop1 from "../assets/data/choreo_hiphop1.json";
import choreo_hiphop2 from "../assets/data/choreo_hiphop2.json";
import choreo_hiphop3 from "../assets/data/choreo_hiphop3.json";

import choreo_samba1 from "../assets/data/choreo_samba1.json";
import choreo_samba2 from "../assets/data/choreo_samba2.json";
import choreo_samba3 from "../assets/data/choreo_samba3.json";

type Step = { time: number; move: string };

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
}

interface Props {
  song: Song;
  danceStyle: "hiphop" | "samba";
  onClose: () => void;
}

function songIndexFromAudio(audioUrl: string) {
  const name = audioUrl.split("/").pop() || audioUrl;
  if (name.includes("song1")) return 1;
  if (name.includes("song2")) return 2;
  if (name.includes("song3")) return 3;
  return 1;
}

function BackgroundImage() {
  const texture = useLoader(TextureLoader, "/bg.jpg"); 
  return <primitive attach="background" object={texture} />;
}

export default function DancePlayer({ song, danceStyle, onClose }: Props) {
  const [currentMove, setCurrentMove] = useState("idle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load choreo
  useEffect(() => {
    const idx = songIndexFromAudio(song.audioUrl);

    let data: any =
      danceStyle === "hiphop"
        ? idx === 1
          ? choreo_hiphop1
          : idx === 2
          ? choreo_hiphop2
          : choreo_hiphop3
        : idx === 1
        ? choreo_samba1
        : idx === 2
        ? choreo_samba2
        : choreo_samba3;

    const loaded = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.steps)
      ? (data as any).steps
      : [];

    setSteps(loaded.sort((a, b) => a.time - b.time));
  }, [song, danceStyle]);

  // Prevent back
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.history.pushState(null, "", window.location.href);
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", preventBack);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", preventBack);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Sync audio + dancer
  useEffect(() => {
    const audio = new Audio(song.audioUrl);
    audioRef.current = audio;

    const updateMove = () => {
      const t = audio.currentTime;

      let left = 0;
      let right = steps.length - 1;
      let found: Step | null = null;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (steps[mid].time <= t) {
          found = steps[mid];
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      if (found && found.move !== currentMove) {
        setCurrentMove(found.move);
      }
    };

    audio.addEventListener("timeupdate", updateMove);
    audio.addEventListener("ended", () => setCurrentMove("idle"));

    audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", updateMove);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [song.audioUrl, steps]);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">

      {/* Header */}
      <div className="relative z-50 px-6 pt-6">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 py-2 rounded text-white"
        >
          <ArrowLeft /> Back
        </button>

        {/* Song info */}
        <div className="mt-4 flex gap-4 items-center">
          <img
            src={song.image}
            className="w-20 h-20 rounded shadow object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{song.title}</h2>
            <p className="text-sm text-white/80">{song.artist}</p>
            <p className="mt-1 text-white/70">Style: {danceStyle}</p>
          </div>
        </div>
      </div>

      {/* 3D model */}
      <div className="flex-1 mt-4">
       <Canvas camera={{ position: [0, 1.8, 5.5], fov: 40}}>
      <BackgroundImage />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 10, 5]} intensity={1.2} />

  <Dancer 
    move={currentMove} 
    danceStyle={danceStyle} 
    isPaused={isPaused} 
  />
</Canvas>
      </div>

      {/* Controls */}
      <div className="w-full px-6 py-4 bg-black/60 backdrop-blur-md flex items-center justify-center gap-6 text-white">

        {/* Backward */}
        <button
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = Math.max(
              0,
              audioRef.current.currentTime - 5
            );
          }}
          className="text-lg"
        >
          ⏪ 
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => {
            if (!audioRef.current) return;

            if (audioRef.current.paused) {
              audioRef.current.play();
              setIsPaused(false); // resume dancer
            } else {
              audioRef.current.pause();
              setIsPaused(true); // pause dancer
            }
          }}
          className="text-xl font-bold"
        >
           {isPaused ? "▶️" : "⏸"}
        </button>

        {/* Forward */}
        <button
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = Math.min(
              audioRef.current.duration,
              audioRef.current.currentTime + 5
            );
          }}
          className="text-lg"
        >
           ⏩
        </button>
      </div>
    </div>
  );
}
