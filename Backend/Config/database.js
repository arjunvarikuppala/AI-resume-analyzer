import mongoose from "mongoose";

import { getMongoConnectionOptions } from "./env.js";

const DATABASE_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

let databaseConnectionPromise;

export const getDatabaseStatus = () => ({
  readyState: mongoose.connection.readyState,
  status: DATABASE_STATE_LABELS[mongoose.connection.readyState] || "unknown",
});

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && databaseConnectionPromise) {
    return databaseConnectionPromise;
  }

  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-resume-analyzer";
  const localFallbackUri = "mongodb://127.0.0.1:27017/ai-resume-analyzer";

  const tryConnect = async (uri, isFallback = false) => {
    return mongoose.connect(uri, getMongoConnectionOptions()).then((connection) => {
      console.log(`MongoDB connected${isFallback ? " (fallback to local)" : ""}`);
      return connection;
    });
  };

  databaseConnectionPromise = (async () => {
    try {
      return await tryConnect(primaryUri);
    } catch (primaryError) {
      if (primaryUri !== localFallbackUri) {
        console.warn(`Primary MongoDB connection failed (${primaryError.message}). Attempting local fallback...`);
        try {
          return await tryConnect(localFallbackUri, true);
        } catch (fallbackError) {
          databaseConnectionPromise = undefined;
          throw new Error(`MongoDB connection failed: Primary (${primaryError.message}) and Fallback (${fallbackError.message})`);
        }
      }
      databaseConnectionPromise = undefined;
      throw primaryError;
    }
  })();

  return databaseConnectionPromise;
};

export const closeDatabase = async () => {
  databaseConnectionPromise = undefined;

  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
