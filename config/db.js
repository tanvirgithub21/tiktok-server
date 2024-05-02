import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://tiktok:tiktok@tiktok.hg4nf29.mongodb.net/?retryWrites=true&w=majority&appName=TikTok");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};