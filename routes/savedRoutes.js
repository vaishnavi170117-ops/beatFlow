import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

/* ------------------------- GET SAVED SONGS ------------------------- */
router.get("/saved", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      savedSongIds: user.savedSongs || []
    });

  } catch (err) {
    console.error("Error fetching saved songs:", err);
    res.status(500).json({ message: "Failed to fetch saved songs" });
  }
});

/* ------------------------- GET FAVORITE SONGS ------------------------- */
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      favoriteSongIds: user.favoriteSongs || []
    });

  } catch (err) {
    console.error("Error fetching favorite songs:", err);
    res.status(500).json({ message: "Failed to fetch favorite songs" });
  }
});

/* ------------------------- SAVE A SONG ------------------------- */
router.put("/:songId/save", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = parseInt(req.params.songId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.savedSongs) user.savedSongs = [];

    if (!user.savedSongs.includes(songId)) {
      user.savedSongs.push(songId);
    }

    await user.save();

    res.json({ message: "Song saved successfully" });

  } catch (err) {
    console.error("Save song error:", err);
    res.status(500).json({ message: "Failed to save song" });
  }
});

/* ------------------------- UNSAVE A SONG ------------------------- */
router.delete("/:songId/save", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = parseInt(req.params.songId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.savedSongs) {
      user.savedSongs = user.savedSongs.filter((id) => id !== songId);
      await user.save();
    }

    res.json({ message: "Song unsaved successfully" });

  } catch (err) {
    console.error("Unsave song error:", err);
    res.status(500).json({ message: "Failed to unsave song" });
  }
});

/* ------------------------- FAVORITE A SONG ------------------------- */
router.put("/:songId/favorite", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = parseInt(req.params.songId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.favoriteSongs) user.favoriteSongs = [];

    if (!user.favoriteSongs.includes(songId)) {
      user.favoriteSongs.push(songId);
    }

    await user.save();

    res.json({ message: "Song favorited successfully" });

  } catch (err) {
    console.error("Favorite song error:", err);
    res.status(500).json({ message: "Failed to favorite song" });
  }
});

/* ------------------------- UNFAVORITE A SONG ------------------------- */
router.delete("/:songId/favorite", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = parseInt(req.params.songId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.favoriteSongs) {
      user.favoriteSongs = user.favoriteSongs.filter((id) => id !== songId);
      await user.save();
    }

    res.json({ message: "Song unfavorited successfully" });

  } catch (err) {
    console.error("Unfavorite song error:", err);
    res.status(500).json({ message: "Failed to unfavorite song" });
  }
});

export default router;
