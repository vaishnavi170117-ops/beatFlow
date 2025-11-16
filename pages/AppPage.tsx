import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Heart, Bookmark, Volume2, Award } from "lucide-react";
import { toast } from "sonner";

import ThemeToggle from "@/components/ThemeToggle";
import SongCard from "@/components/SongCard";
import SongModal from "@/components/SongModal";

import songsData from "../data/songs.json";
import instrumentsData from "../data/instruments.json";
import awardsData from "../data/awards.json";

// NOTE: Keeping this local storage helper function for now,
// but it is no longer used for saved/favorite songs in the new logic.
const getLocalData = (key: string, defaultValue: any = []) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error parsing local storage key: ${key}`, e);
    return defaultValue;
  }
};

type Song = {
  id: number;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
};

const AppPage: React.FC = () => {
  const navigate = useNavigate();

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  
  const [currentUser, setCurrentUser] = useState<string | null>(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingInstrumentId, setPlayingInstrumentId] = useState<number | null>(null);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  
  const [activeInstrument, setActiveInstrument] = useState<any | null>(null);

  // Load only images using Vite glob
  const imageFiles = import.meta.glob("/src/assets/images/*", {
    eager: true,
  }) as Record<string, any>;

  // Load instruments audio (they are in src/assets/audio)
  const instrumentAudioFiles = import.meta.glob("/src/assets/audio/*", {
    eager: true,
  }) as Record<string, any>;

  // SONGS → public folder
  const songs: Song[] = songsData.map((song: any) => ({
    ...song,
    image:
      imageFiles[`/src/assets/images/${song.image}`]?.default ?? song.image,

    // Songs in PUBLIC → must be loaded with absolute URL
    audioUrl: `/${song.audioUrl}`,
  }));

  // INSTRUMENTS → src/assets/audio
  const instruments = instrumentsData.map((ins: any) => ({
    ...ins,
    image:
      imageFiles[`/src/assets/images/${ins.image}`]?.default ?? ins.image,

    // Instruments audio from src/assets/audio
    audio:
      instrumentAudioFiles[`/src/assets/audio/${ins.audio}`]?.default ??
      ins.audio,
  }));

  const awards = awardsData;
  const awardYears = Object.keys(awards);

  // --- MODIFIED: Fetch saved/favorite IDs from the backend ---
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);
    setIsLoggedIn(!!user);

    const fetchUserData = async (userKey: string) => {
        // You'll need a way to get the real auth token here, assuming currentUser is the key/token
        const userToken = userKey; 

        try {
            // Fetch Favorites
            const favResponse = await fetch('/api/user/favorites', {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (favResponse.ok) {
                const data = await favResponse.json();
                // Assuming backend returns { favoriteSongIds: number[] }
                setFavoriteIds(data.favoriteSongIds || []); 
            } else {
                console.error("Failed to fetch favorites from API.");
            }

            // Fetch Saved Songs
            const savedResponse = await fetch('/api/user/saved', {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (savedResponse.ok) {
                const data = await savedResponse.json();
                // Assuming backend returns { savedSongIds: number[] }
                setSavedIds(data.savedSongIds || []);
            } else {
                console.error("Failed to fetch saved songs from API.");
            }
        } catch (error) {
            console.error("Network error fetching user data:", error);
            toast.error("Could not load user data from the server.");
        }
    };

    if (user) {
        fetchUserData(user);
    } else {
        setFavoriteIds([]);
        setSavedIds([]);
    }
  }, []); // Run only once on mount

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setFavoriteIds([]);
    setSavedIds([]);
    setCurrentUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  // --- MODIFIED: toggleLike with API Call ---
  const toggleLike = useCallback((songId: number) => {
    if (!currentUser) return toast.error("Please login to favorite songs");

    const isCurrentlyFav = favoriteIds.includes(songId);
    
    // Optimistic Update
    const prevIds = favoriteIds;
    const newFavIds = isCurrentlyFav 
        ? prevIds.filter((id) => id !== songId) 
        : [...prevIds, songId];
    setFavoriteIds(newFavIds);

    const toggleOnBackend = async () => {
        const userToken = currentUser; // Assuming currentUser holds the token
        const endpoint = `/api/songs/${songId}/favorite`; 
        const method = isCurrentlyFav ? 'DELETE' : 'PUT';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
            });

            if (!response.ok) {
                // Rollback state and show error
                setFavoriteIds(prevIds); 
                toast.error(`Failed to ${isCurrentlyFav ? 'unfavorite' : 'favorite'} song.`);
            } else {
                toast.success(`Song ${isCurrentlyFav ? 'removed from' : 'added to'} favorites!`);
            }
        } catch (error) {
            console.error("API error during toggleLike:", error);
            // Rollback on network error
            setFavoriteIds(prevIds); 
            toast.error("Network error. Try again.");
        }
    };

    toggleOnBackend();
  }, [currentUser, favoriteIds]);

  // --- MODIFIED: toggleSave with API Call ---
  const toggleSave = useCallback((songId: number) => {
    if (!currentUser) return toast.error("Please login to save songs");

    const isCurrentlySaved = savedIds.includes(songId);
    
    // Optimistic Update
    const prevIds = savedIds;
    const newSavedIds = isCurrentlySaved 
        ? prevIds.filter((id) => id !== songId) 
        : [...prevIds, songId];
    setSavedIds(newSavedIds);

    const toggleOnBackend = async () => {
        const userToken = currentUser; // Assuming currentUser holds the token
        const endpoint = `/api/songs/${songId}/save`; 
        const method = isCurrentlySaved ? 'DELETE' : 'PUT';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
            });

            if (!response.ok) {
                // Rollback state and show error
                setSavedIds(prevIds); 
                toast.error(`Failed to ${isCurrentlySaved ? 'unsave' : 'save'} song.`);
            } else {
                toast.success(`Song ${isCurrentlySaved ? 'unsaved' : 'saved'} successfully!`);
            }
        } catch (error) {
            console.error("API error during toggleSave:", error);
            // Rollback on network error
            setSavedIds(prevIds); 
            toast.error("Network error. Try again.");
        }
    };

    toggleOnBackend();
  }, [currentUser, savedIds]);


  return (
    <div
      className="
        min-h-screen transition-all duration-700
        bg-gradient-to-b from-pink-100 via-violet-100 to-pink-200
        dark:from-[#5c007a] dark:via-[#7b2cbf] dark:to-[#4b0082]
      "
    >
      {/* HEADER */}
      {!selectedSong && (
        <header className="bg-white/30 dark:bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-pink-500 via-violet-500 to-pink-600 p-2 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-pink-600 bg-clip-text text-transparent">
                DanceBeats
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <Button variant="ghost" onClick={() => navigate("/saved")}>
                <Bookmark className="w-4 h-4" /> Saved
              </Button>

              <Button variant="ghost" onClick={() => navigate("/favorites")}>
                <Heart className="w-4 h-4" /> Favorites
              </Button>

              <Button variant="ghost" onClick={() => navigate("/create-music")}>
                🎹 Create Music
              </Button>

              <ThemeToggle />

              {isLoggedIn && (
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* SONG LIST */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
          {songs.map((song) => (
            <div key={song.id} className="w-full rounded-xl shadow-md hover:scale-105 transition">
              <SongCard
                image={song.image}
                title={song.title}
                artist={song.artist}
                // Use API-fetched IDs
                isFav={favoriteIds.includes(song.id)}
                isSaved={savedIds.includes(song.id)}
                disabled={playingInstrumentId !== null}  
                onDisabledClick={() =>
                  toast.error("🎵 Please pause instrument audio before opening choreography.", {
                    description: "Stop the instrument audio to view DanceBeats choreography.",
                  })
                }
                onClick={() => {
                  if (!isLoggedIn)
                    return toast.error("Please login to view choreography");

                  setSelectedSong(song);
                }}
                onFav={() => toggleLike(song.id)}
                onSave={() => toggleSave(song.id)}
              />
            </div>
          ))}
        </div>

        {/* INSTRUMENTS */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">
              Musical Instruments
            </h2>
          </div>

          <div
            className="
              grid 
              grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
              xl:grid-cols-5 2xl:grid-cols-6
              gap-6 auto-rows-fr
            "
          >
            {instruments.map((instrument) => (
              <Card
                key={instrument.id}
                className="relative h-full min-h-56 overflow-hidden rounded-xl cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <img
                  src={instrument.image}
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

                <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
                  <h3 className="font-semibold truncate">{instrument.name}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {instrument.description}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-fit bg-white/40 backdrop-blur-md hover:bg-white/60"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (playingInstrumentId === instrument.id) {
                        currentAudio?.pause();
                        setPlayingInstrumentId(null);
                      } else {
                        currentAudio?.pause();

                        const audio = new Audio(instrument.audio);
                        audio.play();

                        setCurrentAudio(audio);
                        setPlayingInstrumentId(instrument.id);
                      }
                    }}
                  >
                    {playingInstrumentId === instrument.id ? "Pause" : "Play"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AWARDS LIST */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">
              Music Awards By Year
            </h2>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <label className="font-medium text-pink-600 dark:text-violet-300">
              Filter by Year:
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1 rounded-md border border-pink-400 dark:border-violet-400 
                bg-white/50 dark:bg-black/30 text-pink-700 dark:text-violet-200 
                focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">All Years</option>
              {awardYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-10">
            {Object.entries(awards)
              .filter(
                ([year]) => selectedYear === "all" || selectedYear === year
              )
              .map(([year, items]) => (
                <div key={year}>
                  <h3 className="text-2xl font-bold text-pink-600 dark:text-violet-300 mb-4">
                    {year}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((award: any, index: number) => (
                      <Card
                        key={index}
                        className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-pink-500
                          bg-gradient-to-br from-pink-100 via-violet-100 to-pink-200
                          dark:from-[#5c007a] dark:via-[#7b2cbf] dark:to-[#4b0082]"
                      >
                        <CardContent className="p-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-pink-200/30 dark:bg-violet-900/30 text-pink-700 dark:text-violet-200">
                            {award.category}
                          </span>

                          <h3 className="font-bold text-base mb-2 dark:text-white">
                            {award.award}
                          </h3>

                          <p className="text-sm text-gray-800 dark:text-gray-300">
                            {award.winner}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* SONG MODAL */}
      {selectedSong && (
        <SongModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
};

export default AppPage;