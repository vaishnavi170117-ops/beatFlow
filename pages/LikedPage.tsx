import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import songsData from "../data/songs.json";

const LikedPage = () => {
  const navigate = useNavigate();
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [songs, setSongs] = useState<any[]>([]);

  // Import assets
  const imageFiles = import.meta.glob("/src/assets/images/*", { eager: true });
  const audioFiles = import.meta.glob("/src/assets/audio/*", { eager: true });

  useEffect(() => {
    // Load liked song IDs
    const liked = JSON.parse(localStorage.getItem("likedSongs") || "[]");
    setLikedIds(liked);

    // Correct asset mapping
    const mapped = songsData.map((song) => ({
      ...song,
      image: (imageFiles[`/src/assets/images/${song.image}`] as any)?.default,
      audioUrl: (audioFiles[`/src/assets/audio/${song.audioUrl}`] as any)?.default,
    }));

    setSongs(mapped);
  }, []);

  // Remove song from liked list
  const removeLike = (songId: number) => {
    const updated = likedIds.filter((id) => id !== songId);
    setLikedIds(updated);
    localStorage.setItem("likedSongs", JSON.stringify(updated));
  };

  // Filter songs to show only liked
  const likedSongs = songs.filter((song) => likedIds.includes(song.id));

  return (
    <div className="p-6 min-h-screen bg-pink-50 dark:bg-pink-200/10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="w-7 h-7 text-red-500" />
          Favourite Songs
        </h1>
        <Button onClick={() => navigate("/app")}>Back</Button>
      </div>

      {likedSongs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No favourite songs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedSongs.map((song) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-3 bg-white/10 rounded-lg shadow-sm backdrop-blur-md hover:bg-white/20 transition"
            >
              <img
                src={song.image}
                className="w-16 h-16 object-cover rounded-md"
                alt={song.title}
              />

              <div className="flex-1">
                <h3 className="font-semibold text-base">{song.title}</h3>
                <p className="text-sm opacity-70">{song.artist}</p>
              </div>

              <button
                onClick={() => removeLike(song.id)}
                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedPage;
