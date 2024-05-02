import express from "express";
import { facebookUploadAndDatabaseUpdated } from "../controllers/facebookUpload.js";

const router = express.Router();

// http://localhost:5000/api/facebook-upload/
router.post("/", facebookUploadAndDatabaseUpdated);

export default router;