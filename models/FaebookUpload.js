import mongoose from "mongoose";

const facebookUpload = new mongoose.Schema(
  {
    videoUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FacebookUpload", facebookUpload);

// videoUrl
// "https://res.cloudinary.com/dr0wx32z6/video/upload/v1714083652/video/ko…"
// createdAt
// 2024-04-25T22:20:53.252+00:00
// updatedAt
// 2024-04-25T22:20:53.252+00:00
// __v
// 0
