import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`MongoDB connected uri: ${process.env.MONGO_URI}`);
  } catch (error) {
    console.log(error);
  }
};