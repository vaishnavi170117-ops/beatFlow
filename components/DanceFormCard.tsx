import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

interface DanceFormCardProps {
  title: string;
  description: string;
  icon: string;
  features?: string[];
  difficulty?: string;
  video?: string;
}

/* 🔥 Converts ANY YouTube link → iframe embed link */
function toEmbedLink(url: string | undefined): string {
  if (!url) return "";

  // Already correct embed link
  if (url.includes("youtube.com/embed")) return url;

  let videoId = "";

  if (url.includes("watch?v=")) {
    // Normal URL: https://www.youtube.com/watch?v=abcd1234&param
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    // Short URL: https://youtu.be/abcd1234
    videoId = url.split("youtu.be/")[1];
  } else {
    // Fallback: take last part of the link
    videoId = url.split("/").pop() || "";
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

const DanceFormCard = ({
  title,
  description,
  icon,
  features,
  difficulty,
  video
}: DanceFormCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Main Card */}
      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-gradient-to-br from-card/90 to-muted/60 border-border/50 hover:border-primary/40 overflow-hidden backdrop-blur-sm relative">
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-6 relative z-10">
          
          {/* Icon */}
          <div className="text-6xl mb-5 group-hover:animate-float group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>

          {/* Difficulty */}
          {difficulty && (
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary mb-3">
              {difficulty}
            </span>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Features */}
          {features && features.length > 0 && (
            <ul className="space-y-2 mt-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* ⭐ Watch Button (Light/Dark Mode Visible) */}
          {video && (
            <button
              onClick={() => setOpen(true)}
              className="
                mt-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all w-fit

                /* Light */
                bg-primary/10 text-primary border border-primary/20 
                hover:bg-primary/20 

                /* Dark */
                dark:bg-white/20 dark:text-white dark:border-white/20
                dark:hover:bg-white/30
              "
            >
              <PlayCircle size={20} />
              Watch Dance Style
            </button>
          )}
        </CardContent>
      </Card>

      {/* ⭐ VIDEO MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-black rounded-xl p-4 shadow-2xl w-11/12 md:w-2/3 lg:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* YouTube Player */}
            <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden">
              <iframe
                src={toEmbedLink(video)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="
                mt-4 w-full py-2 rounded-lg transition text-center font-medium

                /* Light */
                bg-primary/10 text-primary hover:bg-primary/20

                /* Dark */
                dark:bg-white/20 dark:text-white dark:hover:bg-white/30
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DanceFormCard;
