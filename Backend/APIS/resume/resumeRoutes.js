import express from "express";

import {
  getResumeById,
  getResumeHistory,
  uploadResume,
  uploadBulkResumes,
} from "./resumeController.js";
import authMiddleware from "../../middelWares/authMiddleware.js";
import { uploadSingleResume, uploadMultipleResumes } from "../../middelWares/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadSingleResume, uploadResume);
router.post("/upload-bulk", authMiddleware, uploadMultipleResumes, uploadBulkResumes);
router.get("/history", authMiddleware, getResumeHistory);
router.get("/:id", authMiddleware, getResumeById);

export default router;
