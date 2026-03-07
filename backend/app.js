import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";

import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import ApiError from "./utils/ApiError.js";

let databaseConnectionPromise;
let initializationPromise;

const getCorsOptions = () => {
  const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!allowedOrigins.length) {
    return { origin: true, credentials: true };
  }

  return {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new ApiError(403, "Origin is not allowed by CORS."));
    },
  };
};

const ensureRuntimeConfig = () => {
  const missing = ["JWT_SECRET"].filter((key) => !process.env[key]);

  if (!process.env.MONGO_URI) {
    missing.push("MONGO_URI");
  }

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && databaseConnectionPromise) {
    return databaseConnectionPromise;
  }

  databaseConnectionPromise = mongoose
    .connect(process.env.MONGO_URI)
    .then((connection) => {
      console.log("MongoDB connected");
      return connection;
    })
    .catch((error) => {
      databaseConnectionPromise = undefined;
      throw error;
    });

  return databaseConnectionPromise;
};

const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors(getCorsOptions()));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();

export const initializeApp = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      ensureRuntimeConfig();
      await connectDatabase();
      return app;
    })().catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  return initializationPromise;
};

export default app;
