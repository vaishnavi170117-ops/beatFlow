import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onClear: () => void;
}

export const PlaybackControls = ({ isPlaying, onPlay, onPause, onClear }: PlaybackControlsProps) => {
  return (
    <div className="flex gap-4 justify-center">
      <Button
        onClick={isPlaying ? onPause : onPlay}
        size="lg"
        className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg font-semibold px-8"
      >
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Play
          </>
        )}
      </Button>
      <Button
        onClick={onClear}
        size="lg"
        variant="outline"
        className="border-border hover:border-destructive hover:text-destructive hover:bg-destructive/10 font-semibold px-8"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Clear All
      </Button>
    </div>
  );
};
