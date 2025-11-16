// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Heart } from "lucide-react";
// // import SongCard from "@/components/SongCard";

// // import songsData from "../data/songs.json";

// // const FavoritesPage = () => {
// //   const navigate = useNavigate();
// //   const [likedIds, setLikedIds] = useState<number[]>([]);
// //   const [songs, setSongs] = useState<any[]>([]);
// //   const currentUser = localStorage.getItem("currentUser");

// //   const imageFiles = import.meta.glob("/src/assets/images/*", { eager: true });
// //   const audioFiles = import.meta.glob("/src/assets/audio/*", { eager: true });

// //   useEffect(() => {
// //     const liked = JSON.parse(
// //       localStorage.getItem(`${currentUser}_likedSongs`) || "[]"
// //     );
// //     setLikedIds(liked);

// //     const mapped = songsData.map((song) => ({
// //       ...song,
// //       image: (imageFiles[`/src/assets/images/${song.image}`] as any)?.default,
// //       audioUrl: (audioFiles[`/src/assets/audio/${song.audioUrl}`] as any)?.default,
// //     }));

// //     setSongs(mapped);
// //   }, []);

// //   // REMOVE from favorites inside favorites page
// //   const toggleFav = (songId: number) => {
// //     const updated = likedIds.filter((id) => id !== songId);
// //     setLikedIds(updated);
// //     localStorage.setItem(`${currentUser}_likedSongs`, JSON.stringify(updated));
// //   };

// //   const favoriteSongs = songs.filter((s) => likedIds.includes(s.id));

// //   return (
// //     <div className="p-6 min-h-screen">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-3xl font-bold flex items-center gap-2">
// //           <Heart className="w-7 h-7 text-pink-600" />
// //           Favorite Songs
// //         </h1>
// //         <Button onClick={() => navigate("/")}>Back</Button>
// //       </div>

// //       {favoriteSongs.length === 0 ? (
// //         <p className="text-center text-gray-500 mt-10">No favorite songs yet.</p>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {favoriteSongs.map((song) => (
// //             <SongCard
// //               key={song.id}
// //               image={song.image}
// //               title={song.title}
// //               artist={song.artist}
// //               isFav={true}
// //               isSaved={false}
// //               onClick={() => {}}           // required
// //               onFav={() => toggleFav(song.id)}
// //               onSave={() => {}}           // required
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FavoritesPage;
// // src/pages/AppPage.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// import { Music, Heart, Bookmark, Volume2, Award } from "lucide-react";
// import { toast } from "sonner";

// import ThemeToggle from "@/components/ThemeToggle";
// import SongCard from "@/components/SongCard";
// import SongModal from "@/components/SongModal";

// // DATA
// import songsData from "../data/songs.json";
// import instrumentsData from "../data/instruments.json";
// import awardsData from "../data/awards.json";

// const AppPage = () => {
//   const navigate = useNavigate();

//   const [likedSongs, setLikedSongs] = useState<number[]>([]);
//   const [savedSongs, setSavedSongs] = useState<number[]>([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
//   const [playingInstrumentId, setPlayingInstrumentId] = useState<number | null>(null);

//   const [selectedSong, setSelectedSong] = useState<any | null>(null);
//   const [selectedYear, setSelectedYear] = useState("all");

//   // ⭐ FIXED VITE IMPORTS
//   const imageFiles = import.meta.glob("/src/assets/images/*", { eager: true });
//   const audioFiles = import.meta.glob("/src/assets/audio/*", { eager: true });

//   const songs = songsData.map((s) => ({
//     ...s,
//     image: (imageFiles[/src/assets/images/${s.image}] as any)?.default,
//     audioUrl: (audioFiles[/src/assets/audio/${s.audioUrl}] as any)?.default,
//   }));

//   const instruments = instrumentsData.map((ins) => ({
//     ...ins,
//     image: (imageFiles[/src/assets/images/${ins.image}] as any)?.default,
//     audio: (audioFiles[/src/assets/audio/${ins.audio}] as any)?.default,
//   }));

//   const awards = awardsData;
//   const awardYears = Object.keys(awards);

//   // LOAD LOGIN & SAVED STATE
//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("currentUser"));
//     setLikedSongs(JSON.parse(localStorage.getItem("likedSongs") || "[]"));
//     setSavedSongs(JSON.parse(localStorage.getItem("savedSongs") || "[]"));
//   }, []);

//   // LOGOUT
//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   // LIKE SONG
//   const toggleLike = (id: number) => {
//     if (!isLoggedIn) return toast.error("Please login to like songs");

//     const updated = likedSongs.includes(id)
//       ? likedSongs.filter((x) => x !== id)
//       : [...likedSongs, id];

//     setLikedSongs(updated);
//     localStorage.setItem("likedSongs", JSON.stringify(updated));
//   };

//   // SAVE SONG
//   const toggleSave = (id: number) => {
//     if (!isLoggedIn) return toast.error("Please login to save songs");

//     const updated = savedSongs.includes(id)
//       ? savedSongs.filter((x) => x !== id)
//       : [...savedSongs, id];

//     setSavedSongs(updated);
//     localStorage.setItem("savedSongs", JSON.stringify(updated));
//   };

//   return (
//     <div
//       className="
//         min-h-screen transition-all duration-700
//         bg-gradient-to-b from-pink-100 via-violet-100 to-pink-200
//         dark:from-[#5c007a] dark:via-[#7b2cbf] dark:to-[#4b0082]
//       "
//     >
//       {/* HEADER */}
//       {!selectedSong && (
//         <header className="bg-white/30 dark:bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
//           <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//             {/* LOGO */}
//             <div className="flex items-center gap-2">
//               <div className="bg-gradient-to-br from-pink-500 via-violet-500 to-pink-600 p-2 rounded-lg">
//                 <Music className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-pink-600 bg-clip-text text-transparent">
//                 DanceBeats
//               </span>
//             </div>

//             {/* NAV BUTTONS */}
//             <div className="flex gap-3 items-center">
//               <Button variant="ghost" onClick={() => navigate("/saved")}>
//                 <Bookmark className="w-4 h-4" /> Saved
//               </Button>

//               <Button variant="ghost" onClick={() => navigate("/favorites")}>
//                 <Heart className="w-4 h-4" /> Favorites
//               </Button>

//               <Button variant="ghost" onClick={() => navigate("/create-music")}>
//                 🎹 Create Music
//               </Button>

//               <ThemeToggle />

//               {isLoggedIn && (
//                 <Button variant="outline" onClick={handleLogout}>
//                   Logout
//                 </Button>
//               )}
//             </div>
//           </div>
//         </header>
//       )}

//       {/* SONG LIST */}
//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
//           {songs.map((song) => (
//             <div key={song.id} className="w-full rounded-xl shadow-md hover:scale-105 transition">
//               <SongCard
//                 image={song.image}
//                 title={song.title}
//                 artist={song.artist}
//                 onClick={() => {
//                   if (!isLoggedIn) return toast.error("Please login to view choreography");
//                   setSelectedSong(song);
//                 }}
//                 isFav={likedSongs.includes(song.id)}
//                 isSaved={savedSongs.includes(song.id)}
//                 onFav={() => toggleLike(song.id)}
//                 onSave={() => toggleSave(song.id)}
//               />
//             </div>
//           ))}
//         </div>

//         {/* INSTRUMENTS SECTION */}
//         <div className="mt-16">
//           <div className="flex items-center gap-3 mb-6">
//             <Volume2 className="w-8 h-8 text-pink-600" />
//             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">
//               Musical Instruments
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//             {instruments.map((instrument) => (
//               <Card
//                 key={instrument.id}
//                 className="relative h-full min-h-56 overflow-hidden rounded-xl cursor-pointer hover:scale-105 transition-all"
//               >
//                 <img
//                   src={instrument.image}
//                   className="absolute inset-0 w-full h-full object-cover opacity-60"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

//                 <CardContent className="relative z-10 text-white p-4 flex flex-col justify-end h-full">
//                   <h3 className="font-semibold truncate">{instrument.name}</h3>
//                   <p className="text-sm opacity-90">{instrument.description}</p>

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="mt-3 bg-white/30 backdrop-blur-lg"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (playingInstrumentId === instrument.id) {
//                         currentAudio?.pause();
//                         setPlayingInstrumentId(null);
//                       } else {
//                         currentAudio?.pause();
//                         const audio = new Audio(instrument.audio);
//                         audio.play();
//                         setCurrentAudio(audio);
//                         setPlayingInstrumentId(instrument.id);
//                       }
//                     }}
//                   >
//                     {playingInstrumentId === instrument.id ? "Pause" : "Play"}
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* AWARDS */}
//         <div className="mt-20">
//           <div className="flex items-center gap-3 mb-6">
//             <Award className="w-8 h-8 text-pink-600" />
//             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">
//               Music Awards By Year
//             </h2>
//           </div>

//           <div className="flex items-center gap-4">
//             <label>Filter:</label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="px-3 py-1 rounded-md border bg-white/50"
//             >
//               <option value="all">All Years</option>
//               {awardYears.map((year) => (
//                 <option key={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <div className="mt-8 space-y-10">
//             {Object.entries(awards)
//               .filter(([year]) => selectedYear === "all" || selectedYear === year)
//               .map(([year, items]) => (
//                 <div key={year}>
//                   <h3 className="text-xl font-bold mb-4">{year}</h3>

//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     {(items as any[]).map((award, i) => (
//                       <Card key={i} className="bg-white/50 backdrop-blur-md">
//                         <CardContent className="p-4">
//                           <p className="text-sm font-bold">{award.award}</p>
//                           <p className="text-sm">{award.winner}</p>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </main>

//       {/* SONG MODAL (your dancing page trigger) */}
//       {selectedSong && (
//         <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />
//       )}
//     </div>
//   );
// };

// export default AppPage;