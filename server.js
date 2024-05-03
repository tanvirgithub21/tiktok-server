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

console.log("Every 5 secondes");
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

    console.log({ result, utcTime });
    // Perform your action here when it's 7:00 PM
  }
}, 1000); // Check every second

// download tiktok video
app.post("/api/download", async (req, res) => {
  const { url } = req?.body || {};

  if (url) {
    const regex = /(https:\/\/www\.tiktok\.com\/@reinita_4\/video\/\d+)/g;

    const validLinks = url.match(regex);

    if (validLinks) {
      try {
        const data = await Promise.all(
          validLinks.map(async (singleUrl, index) => {

            await new Promise(resolve => setTimeout(resolve, index * 1000));


            let domain = "https://www.tikwm.com/";
            let apiUrl = domain + "api/";
            let params = new URLSearchParams({
              url: singleUrl,
              count: 12,
              cursor: 0,
              web: 1,
              hd: 1,
            });

            const res = await fetch(apiUrl + "?" + params.toString(), {
              method: "POST",
              headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                // 'cookie': 'current_language=en; _ga=GA1.1.115940210.1660795490; _gcl_au=1.1.669324151.1660795490; _ga_5370HT04Z3=GS1.1.1660795489.1.1.1660795513.0.0.0',
                "sec-ch-ua":
                  '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
              },
            });
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const responseData = await res.json();

            console.log(responseData, "line 98");

            return {
              video: domain + responseData?.data?.play,
              wm: domain + responseData?.data?.wmplay,
              music: domain + responseData?.data?.music,
            };
          })
        );

        console.log(data);
        res.json({ success: true, data });
      } catch (error) {
        console.error("Fetch Error:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Link not found",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Link not found",
    });
  }
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
