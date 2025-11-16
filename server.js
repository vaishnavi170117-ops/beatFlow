import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import userRoutes from "./routes/userroutes.js";
import songRoutes from "./routes/songRoutes.js";
import danceStyleRoutes from "./routes/danceStyleRoutes.js";
import savedRoutes from "./routes/savedRoutes.js"; // <-- Added for saved/favorite songs

dotenv.config();

const app = express();

// ------------------- MIDDLEWARES -------------------
app.use(cors());
app.use(express.json());

// ------------------- API ROUTES -------------------
app.use("/api/users", userRoutes);                // Signup / Login
app.use("/api/songs", songRoutes);               // Songs
app.use("/api/dancestyles", danceStyleRoutes);   // Dance styles
app.use("/api/user", savedRoutes);               // Saved songs / Favorites

// ------------------- MONGODB CONNECTION -------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/danceApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ------------------- DEFAULT ROUTE -------------------
app.get("/", (req, res) => {
  res.send("🎶 Welcome to the Dance App Backend API");
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
