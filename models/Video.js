import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },

    videoUrl: String,
    thumbnail_url: String,
    public_id: String,
    filenam: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);
