import express from "express";
import { createVideo, findAllVideo } from "../controllers/video.js";

const router = express.Router();

// http://localhost:5000/api/videos/
router.post("/", createVideo);

// http://localhost:5000/api/videos/
router.get("/", findAllVideo)
export default router;