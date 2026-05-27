import multer from "multer";

import ApiError from "../utils/ApiError.js";
import { maxUploadSizeMb } from "./uploadMiddleware.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? `The uploaded file exceeds the ${maxUploadSizeMb} MB size limit.`
        : error.message;

    res.status(400).json({ message });
    return;
  }

  const statusCode = error.statusCode || 500;
  const payload = {
    message: error.message || "Internal server error.",
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};
