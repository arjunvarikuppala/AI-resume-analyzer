import cors from "cors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

import { registerApiRoutes } from "./APIS/index.js";
import { getCorsOptions } from "./Config/cors.js";
import { closeDatabase, connectDatabase, getDatabaseStatus } from "./Config/database.js";
import { ensureRuntimeConfig, getNodeEnv, getServerConfig } from "./Config/env.js";
import { errorHandler, notFound } from "./middleWares/errorHandler.js";

let initializationPromise;

const createHealthPayload = () => ({
  status: "ok",
  environment: getNodeEnv(),
  timestamp: new Date().toISOString(),
  uptime: Number(process.uptime().toFixed(2)),
  database: getDatabaseStatus(),
});

export const createApp = () => {
  const app = express();
  const serverConfig = getServerConfig();

  app.disable("x-powered-by");
  app.set("trust proxy", serverConfig.trustProxy);

  app.use(helmet());
  app.use(cors(getCorsOptions()));
  app.use(express.json({ limit: serverConfig.jsonBodyLimit }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(getNodeEnv() === "production" ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.status(200).json(createHealthPayload());
  });

  registerApiRoutes(app);

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

export const closeApp = async () => {
  initializationPromise = undefined;
  await closeDatabase();
};

export default app;
