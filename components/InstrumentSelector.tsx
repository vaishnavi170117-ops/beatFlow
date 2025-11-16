import { Music, Drum, Guitar, Radio } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type InstrumentType = "drum" | "bass" | "melody" | "synth";

interface InstrumentSelectorProps {
  selected: InstrumentType;
  onSelect: (type: InstrumentType) => void;
}

export const InstrumentSelector = ({ selected, onSelect }: InstrumentSelectorProps) => {
  const instruments = [
    { type: "drum" as InstrumentType, icon: Drum, label: "Drums", color: "drum" },
    { type: "bass" as InstrumentType, icon: Music, label: "Bass", color: "bass" },
    { type: "melody" as InstrumentType, icon: Guitar, label: "Melody", color: "melody" },
    { type: "synth" as InstrumentType, icon: Radio, label: "Synth", color: "synth" },
  ];

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {instruments.map(({ type, icon: Icon, label, color }) => (
        <Button
          key={type}
          onClick={() => onSelect(type)}
          variant={selected === type ? "default" : "outline"}
          size="lg"
          className={cn(
            "flex items-center gap-2 transition-all font-semibold",
            selected === type && `bg-${color} hover:bg-${color}/80 text-white border-${color} shadow-lg`,
            selected !== type && "border-border hover:border-foreground/30"
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Button>
      ))}
    </div>
  );
};
