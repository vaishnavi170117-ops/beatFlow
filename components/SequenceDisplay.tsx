import { X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Sound {
  id: number;
  type: "drum" | "bass" | "melody" | "synth";
  name: string;
  frequency: number;
}

interface SequenceDisplayProps {
  sequence: Sound[];
  onDelete: (id: number) => void;
}

export const SequenceDisplay = ({ sequence, onDelete }: SequenceDisplayProps) => {
  if (sequence.length === 0) return null;

  const colorMap = {
    drum: "bg-drum/20 text-drum border-drum/30",
    bass: "bg-bass/20 text-bass border-bass/30",
    melody: "bg-melody/20 text-melody border-melody/30",
    synth: "bg-synth/20 text-synth border-synth/30",
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
        Your Sequence ({sequence.length} sounds)
      </h3>
      <div className="flex flex-wrap gap-2">
        {sequence.map((sound, index) => (
          <div
            key={sound.id}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all",
              colorMap[sound.type]
            )}
          >
            <span>
              {index + 1}. {sound.type} - {sound.name}
            </span>
            <Button
              onClick={() => onDelete(sound.id)}
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
