import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import songsData from "../data/songs.json";

const SavedPage = () => {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [songs, setSongs] = useState<any[]>([]);

  // Import assets
  const imageFiles = import.meta.glob("/src/assets/images/*", { eager: true });
  const audioFiles = import.meta.glob("/src/assets/audio/*", { eager: true });

  useEffect(() => {
    // Load saved song IDs
    const saved = JSON.parse(localStorage.getItem("savedSongs") || "[]");
    setSavedIds(saved);

    // Map images + audio correctly
    const mapped = songsData.map((song) => ({
      ...song,
      image: (imageFiles[`/src/assets/images/${song.image}`] as any)?.default,
      audioUrl: (audioFiles[`/src/assets/audio/${song.audioUrl}`] as any)?.default,
    }));

    setSongs(mapped);
  }, []);

  // Remove saved song
  const removeSaved = (songId: number) => {
    const updated = savedIds.filter((id) => id !== songId);
    setSavedIds(updated);
    localStorage.setItem("savedSongs", JSON.stringify(updated));
  };

  // Filter only saved songs
  const savedSongs = songs.filter((song) => savedIds.includes(song.id));

  return (
    <div className="p-6 min-h-screen bg-pink-50 dark:bg-pink-200/10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-pink-600" />
          Saved Songs
        </h1>
        <Button onClick={() => navigate("/app")}>Back</Button>
      </div>

      {savedSongs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No saved songs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSongs.map((song) => (
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
                onClick={() => removeSaved(song.id)}
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

export default SavedPage;
