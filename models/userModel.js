import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,          // prevents duplicate accounts
      lowercase: true,       // normalize emails
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    savedSongs: {
      type: [Number],
      default: []
    },

    favoriteSongs: {
      type: [Number],
      default: []
    }
  },

  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

// Avoid OverwriteModelError in development
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
