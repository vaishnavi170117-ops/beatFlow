import express from "express";
import DanceStyle from "../models/danceStyleModel.js";

const router = express.Router();
router.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.originalUrl}`);
  next();
});


// ➕ Add new dance style
router.post("/", async (req, res) => {
  try {
    const style = new DanceStyle(req.body);
    await style.save();
    res.status(201).json(style);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get all dance styles
router.get("/", async (req, res) => {
  try {
    const styles = await DanceStyle.find();
    res.json(styles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update dance style
router.put("/:id", async (req, res) => {
  try {
    const style = await DanceStyle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!style) return res.status(404).json({ message: "Dance style not found" });
    res.json(style);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete dance style
router.delete("/:id", async (req, res) => {
  try {
    const style = await DanceStyle.findByIdAndDelete(req.params.id);
    if (!style) return res.status(404).json({ message: "Dance style not found" });
    res.json({ message: "Dance style deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
