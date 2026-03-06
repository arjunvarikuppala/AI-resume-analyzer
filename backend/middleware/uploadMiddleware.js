import path from "path";

import multer from "multer";

import ApiError from "../utils/ApiError.js";

const maxUploadSizeMb = Number(process.env.MAX_UPLOAD_SIZE_MB || 5);
const allowedExtensions = new Set([".pdf", ".docx"]);

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: maxUploadSizeMb * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();

    if (!allowedExtensions.has(extension)) {
      callback(new ApiError(400, "Only PDF and DOCX resumes are supported."));
      return;
    }

    callback(null, true);
  },
});

export const uploadSingleResume = upload.single("resume");
