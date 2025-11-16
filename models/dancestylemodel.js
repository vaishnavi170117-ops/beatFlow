import mongoose from "mongoose";

const danceStyleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dance style name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "No description provided",
      trim: true,
    },
  },
  { timestamps: true }
);

const DanceStyle = mongoose.model("DanceStyle", danceStyleSchema);
export default DanceStyle;
