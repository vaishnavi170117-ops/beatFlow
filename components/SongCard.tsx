import React from "react";
import { Heart, Bookmark } from "lucide-react";

interface SongCardProps {
  image: string;
  title: string;
  artist: string;
  onClick: () => void;
  onSave: () => void;
  onFav: () => void;
  isSaved: boolean;
  isFav: boolean;

  // optional
  disabled?: boolean;
  onDisabledClick?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({
  image,
  title,
  artist,
  onClick,
  onSave,
  onFav,
  isSaved,
  isFav,
  disabled = false,
  onDisabledClick,
}) => {
  
  const handleIconClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: () => void
  ) => {
    e.stopPropagation(); // prevent card click
    action();
  };

  const handleCardClick = () => {
    if (disabled && onDisabledClick) {
      onDisabledClick();
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl p-5 w-52 sm:w-60 cursor-pointer
        transform-gpu transition-all duration-300
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.03]"}
        backdrop-blur-md overflow-hidden
        border border-pink-300/50 dark:border-pink-600/40
        bg-gradient-to-br from-pink-100/90 via-violet-100/80 to-pink-200/80
        dark:from-pink-500/70 dark:via-violet-500/70 dark:to-pink-600/70
        shadow-[0_0_15px_rgba(236,72,153,0.3)]
        hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]
      `}
    >
      <div className="relative z-10">
        <img
          src={image}
          alt={title}
          className="rounded-xl w-full h-44 object-cover border border-white/20
            transform transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="relative z-10 flex justify-between items-center mt-4">
        <div>
          <h3 className="text-lg font-semibold truncate dark:text-white text-gray-800">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {artist}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Favorite Button */}
          <button
            onClick={(e) => handleIconClick(e, onFav)}
            className="p-1.5 rounded-full hover:bg-pink-100/40 transition"
          >
            <Heart
              size={18}
              className={
                isFav
                  ? "fill-red-500 text-pink-500"
                  : "text-gray-700 dark:text-white"
              }
            />
          </button>

          {/* Save Button */}
          <button
            onClick={(e) => handleIconClick(e, onSave)}
            className="p-1.5 rounded-full hover:bg-pink-100/40 transition"
          >
            <Bookmark
              size={18}
              className={
                isSaved
                  ? "fill-blue-500 text-blue-500"
                  : "text-gray-700 dark:text-white"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
