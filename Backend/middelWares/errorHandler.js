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

  // Handle MongoDB duplicate key error (code 11000)
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern || error.keyValue || {});
    const field = keys.length ? keys[0] : "field";
    res.status(409).json({
      message: `An account with this ${field} already exists.`,
    });
    return;
  }

  // Handle Mongoose ValidationError
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors || {}).map((err) => err.message);
    res.status(400).json({
      message: "Validation failed.",
      details,
    });
    return;
  }

  // Handle Mongoose connection/buffering timeout
  if (error.name === "MongooseError" && error.message?.includes("buffering timed out")) {
    res.status(503).json({
      message: "Database connection timeout. Please check database connectivity.",
    });
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
