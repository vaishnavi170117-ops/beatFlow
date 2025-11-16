import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Gamepad2, Bookmark } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHomeClick = () => {
    // Navigate to app page without authentication (limited access)
    navigate("/app");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary via-accent to-secondary p-2 rounded-lg group-hover:animate-pulse-glow transition-all">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            DanceBeats
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={handleHomeClick}
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Home
          </button>

          <a
            href="#about"
            onClick={handleAboutClick}
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            About
          </a>

          <Link
            to="/game"
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
          >
            Game
          </Link>

          {/* ⭐ ADDED: Saved Songs Link */}
          <Link
            to="/saved"
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </Link>

          <ThemeToggle />

          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-primary/10">
                Login
              </Button>
            </Link>

            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 transition-opacity">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
