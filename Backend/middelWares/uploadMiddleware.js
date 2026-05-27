import path from "path";

import multer from "multer";

import ApiError from "../utils/ApiError.js";

const parseUploadLimit = () => {
  const fallbackLimitMb = process.env.VERCEL ? 4 : 5;
  const configuredLimitMb = Number(process.env.MAX_UPLOAD_SIZE_MB || fallbackLimitMb);
  const normalizedLimitMb =
    Number.isFinite(configuredLimitMb) && configuredLimitMb > 0
      ? configuredLimitMb
      : fallbackLimitMb;

  // Some serverless platforms reject larger request bodies before Multer can process them.
  return process.env.VERCEL ? Math.min(normalizedLimitMb, 4) : normalizedLimitMb;
};

export const maxUploadSizeMb = parseUploadLimit();
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
