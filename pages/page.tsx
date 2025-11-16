import { useState } from "react";
import { Music, Play } from "lucide-react";
import SongModal from "@/components/SongModal";

export interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: "Electric Dreams",
    artist: "Neon Pulse",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    audioUrl: "/audio/song1.mp3",
  },
  {
    id: 2,
    title: "Midnight Groove",
    artist: "Luna Beat",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audioUrl: "/audio/song2.mp3",
  },
  {
    id: 3,
    title: "Summer Vibes",
    artist: "Tropical Sounds",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    audioUrl: "/audio/song3.mp3",
  },
];

const Index = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-md border border-border rounded-full px-6 py-3 mb-6">
            <Music className="w-6 h-6 text-primary" />
            <span className="text-foreground font-medium">Dance & Beats</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Choose Your Track
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select a song and pick your dance style to see AI-powered choreography
          </p>
        </div>

        {/* Song Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="group relative animate-fade-in hover-scale cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedSong(song)}
            >
              <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-primary-foreground fill-current" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-muted-foreground">{song.artist}</p>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'var(--shadow-glow)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedSong && (
        <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />
      )}
    </div>
  );
};

export default Index;
