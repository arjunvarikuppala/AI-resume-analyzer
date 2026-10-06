import mongoose from "mongoose";

import { getMongoConnectionOptions } from "./env.js";

const DATABASE_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

let databaseConnectionPromise;
let memoryServerInstance;

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

  const primaryUri = process.env.MONGO_URI;
  const localFallbackUri = "mongodb://127.0.0.1:27017/ai-resume-analyzer";

  const tryConnect = async (uri, label = "database") => {
    return mongoose.connect(uri, getMongoConnectionOptions()).then((connection) => {
      console.log(`✅ MongoDB connected successfully via ${label}`);
      return connection;
    });
  };

  databaseConnectionPromise = (async () => {
    if (primaryUri) {
      try {
        return await tryConnect(primaryUri, "Primary MONGO_URI");
      } catch (primaryError) {
        console.warn(`⚠️ Primary MongoDB connection failed (${primaryError.message}). Attempting local fallback...`);
      }
    }

    try {
      return await tryConnect(localFallbackUri, "local instance (127.0.0.1)");
    } catch (localError) {
      console.warn(`⚠️ Local MongoDB connection failed (${localError.message}). Initializing In-Memory MongoDB Server...`);
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        if (!memoryServerInstance) {
          memoryServerInstance = await MongoMemoryServer.create();
        }
        const memoryUri = memoryServerInstance.getUri();
        return await tryConnect(memoryUri, "in-memory fallback database");
      } catch (memoryError) {
        databaseConnectionPromise = undefined;
        const msg = `MongoDB connection failed: Primary, Local, and In-Memory fallbacks all failed (${memoryError.message})`;
        console.error(`❌ ${msg}`);
        throw new Error(msg);
      }
    }
  })();

  return databaseConnectionPromise;
};

export const closeDatabase = async () => {
  databaseConnectionPromise = undefined;

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = undefined;
  }
};

