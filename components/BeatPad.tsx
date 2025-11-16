import { useState } from "react";
import { cn } from "@/lib/utils";

interface BeatPadProps {
  id: number;
  instrumentType: "drum" | "bass" | "melody" | "synth";
  soundName: string;
  onPlay: () => void;
}

export const BeatPad = ({ id, instrumentType, soundName, onPlay }: BeatPadProps) => {
  const [isActive, setIsActive] = useState(false);

  const colorMap = {
    drum: "bg-drum hover:bg-drum/80",
    bass: "bg-bass hover:bg-bass/80",
    melody: "bg-melody hover:bg-melody/80",
    synth: "bg-synth hover:bg-synth/80",
  };

  const handleClick = () => {
    setIsActive(true);
    onPlay();
    setTimeout(() => setIsActive(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative aspect-square rounded-xl transition-all duration-200 transform",
        "flex flex-col items-center justify-center gap-2",
        "border-2 shadow-lg",
        colorMap[instrumentType],
        isActive && "scale-95 brightness-110 border-white/50",
        "hover:scale-105 hover:brightness-110"
      )}
    >
      <span className="text-3xl font-bold text-white drop-shadow-lg">
        {id}
      </span>
      <span className="text-xs text-white/90 font-semibold uppercase tracking-wide">
        {soundName}
      </span>
    </button>
  );
};
