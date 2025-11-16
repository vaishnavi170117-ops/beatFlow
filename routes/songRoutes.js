import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getSavedSongs,
  getFavoriteSongs,
  saveSong,
  unsaveSong,
  favoriteSong,
  unfavoriteSong
} from "../controllers/savedController.js";

const router = express.Router();

// Saved songs
router.get("/saved", verifyToken, getSavedSongs);
router.put("/:songId/save", verifyToken, saveSong);
router.delete("/:songId/save", verifyToken, unsaveSong);

// Favorite songs
router.get("/favorites", verifyToken, getFavoriteSongs);
router.put("/:songId/favorite", verifyToken, favoriteSong);
router.delete("/:songId/favorite", verifyToken, unfavoriteSong);

export default router;
