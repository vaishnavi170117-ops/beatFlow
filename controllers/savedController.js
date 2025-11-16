import User from "../models/userModel.js";

/* ------------------------- GET SAVED SONGS ------------------------- */
export const getSavedSongs = async (req, res) => {
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
};

/* ------------------------- GET FAVORITE SONGS ------------------------- */
export const getFavoriteSongs = async (req, res) => {
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
};

/* ------------------------- SAVE A SONG ------------------------- */
export const saveSong = async (req, res) => {
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
    console.error("Error saving song:", err);
    res.status(500).json({ message: "Failed to save song" });
  }
};

/* ------------------------- UNSAVE A SONG ------------------------- */
export const unsaveSong = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = parseInt(req.params.songId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.savedSongs) {
      user.savedSongs = user.savedSongs.filter(id => id !== songId);
    }

    await user.save();

    res.json({ message: "Song unsaved successfully" });

  } catch (err) {
    console.error("Error unsaving song:", err);
    res.status(500).json({ message: "Failed to unsave song" });
  }
};

/* ------------------------- FAVORITE A SONG ------------------------- */
export const favoriteSong = async (req, res) => {
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
    console.error("Error favoriting song:", err);
    res.status(500).json({ message: "Failed to favorite song" });
  }
};

/* ------------------------- UNFAVORITE A SONG ------------------------- */
export const unfavoriteSong = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = parseInt(req.params.songId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.favoriteSongs) {
      user.favoriteSongs = user.favoriteSongs.filter(id => id !== songId);
    }

    await user.save();

    res.json({ message: "Song unfavorited successfully" });

  } catch (err) {
    console.error("Error unfavoriting song:", err);
    res.status(500).json({ message: "Failed to unfavorite song" });
  }
};
