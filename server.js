import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/video.js";
import vacebookUploadRoute from "./routes/facebookUpload.js";
import { errorHandler } from "./middlewares/error.js";
import { connectCloudinary } from "./config/cloudinary.js";
import moment from "moment-timezone";
import axios from "axios";
import fetch from "node-fetch";
import { tiktokVideoDownlode } from "./lib/tiktokVideoDownlode.js";

dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/facebook-upload", vacebookUploadRoute);

// Function to check if it's 7:00 PM local time
const is7PM = () => moment().format("HH:mm:ss") === "19:00:01";
const is7_10PM = () => moment().format("HH:mm:ss") === "19:10:01";
const is7_20PM = () => moment().format("HH:mm:ss") === "19:20:01";
const is7_30PM = () => moment().format("HH:mm:ss") === "19:30:01";
const is7_40PM = () => moment().format("HH:mm:ss") === "19:40:01";
const text = () => moment().format("HH:mm:ss") === "22:15:01";

// Function to convert local time to UTC time
const localToUTC = (localTime) => moment(localTime).utc();
setInterval(async () => {
  if (
    is7PM() ||
    is7_10PM() ||
    is7_20PM() ||
    is7_30PM() ||
    is7_40PM() ||
    text()
  ) {
    const localTime = moment();
    const utcTime = localToUTC(localTime);
    console.log(`Local time is 7:00 PM. UTC time is ${utcTime.format()}`);
    const req = await fetch(`${process.env.server_url}/api/facebook-upload`, {
      method: "POST",
    });
    const result = await req.json();

    // Perform your action here when it's 7:00 PM
  }
}, 1000); // Check every second

// download tiktok video
app.post("/api/download", async (req, res) => {
  await tiktokVideoDownlode(req, res);
});

// root api
app.get("/", (req, res) => {
  res.json(`server is rurning ${port}`);
});

app.use(errorHandler);

// Listen to the requests
app.listen(port, () => {
  connectCloudinary();
  // connect to DB
  connectDB();
  console.log("Server started listening on port", port);
});
