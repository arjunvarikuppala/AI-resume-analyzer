import express from "express";

import {
  getResumeById,
  getResumeHistory,
  uploadResume,
} from "./resumeController.js";
import authMiddleware from "../../middelWares/authMiddleware.js";
import { uploadSingleResume } from "../../middelWares/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadSingleResume, uploadResume);
router.get("/history", authMiddleware, getResumeHistory);
router.get("/:id", authMiddleware, getResumeById);

export default router;
