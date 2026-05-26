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

  databaseConnectionPromise = mongoose
    .connect(process.env.MONGO_URI, getMongoConnectionOptions())
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

export const closeDatabase = async () => {
  databaseConnectionPromise = undefined;

  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
