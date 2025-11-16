import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Song title is required"],
      trim: true,
    },
    artist: {
      type: String,
      trim: true,
      default: "Unknown Artist",
    },
    danceStyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DanceStyle",
      required: [true, "Dance style reference is required"],
    },
    videoURL: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Please provide a valid video URL",
      },
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
