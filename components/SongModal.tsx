// src/components/SongModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import DancePlayer from "./DancePlayer";

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
}

interface SongModalProps {
  song: Song | null;
  onClose: () => void;
}

const SongModal: React.FC<SongModalProps> = ({ song, onClose }) => {
  console.log("%c USING THIS SONGMODAL ", "background: yellow; color: black");
  const [style, setStyle] = useState<"hiphop" | "samba" | null>(null);

  if (!song) return null;

  // When style is selected → load dance screen
  if (style) {
    return (
      <DancePlayer
        song={song}
        danceStyle={style}
        onClose={() => {
          setStyle(null); // Go back to style choose screen
        }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose} // close modal when clicking background
    >
      <div
        className="bg-white/10 text-white rounded-2xl p-8 shadow-xl w-3/4 max-w-3xl flex relative z-50"
        onClick={(e) => e.stopPropagation()} // prevent background close
      >
        {/* Close button */}
        <button
          className="absolute right-4 top-4 z-50"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* LEFT SIDE */}
        <div className="w-1/2 border-r border-white/20 pr-6 flex flex-col items-center">
          <img
            src={song.image}
            className="w-48 h-48 rounded-xl shadow-lg object-cover"
            alt=""
          />
          <h2 className="text-3xl font-bold mt-4">{song.title}</h2>
          <p className="text-xl opacity-80">{song.artist}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 pl-6 flex flex-col justify-center gap-6">
          <h3 className="text-xl font-semibold">Choose Dance Style 💃</h3>

          <button
            className="bg-white/10 hover:bg-white/20 p-3 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setStyle("hiphop");
            }}
          >
            Hip Hop
          </button>

          <button
            className="bg-white/10 hover:bg-white/20 p-3 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setStyle("samba");
            }}
          >
            Samba
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongModal;
