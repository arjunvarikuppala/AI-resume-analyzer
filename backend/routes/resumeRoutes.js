import express from "express";

import {
  getResumeById,
  getResumeHistory,
  uploadResume,
} from "../controllers/resumeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadSingleResume } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadSingleResume, uploadResume);
router.get("/history", authMiddleware, getResumeHistory);
router.get("/:id", authMiddleware, getResumeById);

export default router;
