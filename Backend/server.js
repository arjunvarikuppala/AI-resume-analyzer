import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { pathToFileURL } from "url";

import { registerApiRoutes } from "./APIS/index.js";
import { getCorsOptions } from "./Config/cors.js";
import { closeDatabase, connectDatabase, getDatabaseStatus } from "./Config/database.js";
import { ensureRuntimeConfig, getNodeEnv, getServerConfig } from "./Config/env.js";
import { errorHandler, notFound } from "./middelWares/errorHandler.js";

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"];

let initializationPromise;
let server;
let processHandlersRegistered = false;
let shutdownPromise;

const createHealthPayload = () => ({
  status: "ok",
  environment: getNodeEnv(),
  timestamp: new Date().toISOString(),
  uptime: Number(process.uptime().toFixed(2)),
  database: getDatabaseStatus(),
});

export const createApp = () => {
  const nextApp = express();
  const serverConfig = getServerConfig();

  nextApp.disable("x-powered-by");
  nextApp.set("trust proxy", serverConfig.trustProxy);

  nextApp.use(helmet());
  nextApp.use(cors(getCorsOptions()));
  nextApp.use(express.json({ limit: serverConfig.jsonBodyLimit }));
  nextApp.use(express.urlencoded({ extended: true }));
  nextApp.use(morgan(getNodeEnv() === "production" ? "combined" : "dev"));

  nextApp.get("/api/health", (_req, res) => {
    res.status(200).json(createHealthPayload());
  });

  registerApiRoutes(nextApp);

  nextApp.use(notFound);
  nextApp.use(errorHandler);

  return nextApp;
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

const closeHttpServer = () =>
  new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      server = undefined;
      resolve();
    });
  });

export const startServer = async () => {
  if (server?.listening) {
    return server;
  }

  await initializeApp();

  const { host, port } = getServerConfig();

  server = await new Promise((resolve, reject) => {
    const nextServer = app.listen(port, host, () => {
      console.log(`API server listening on http://${host}:${port}`);
      resolve(nextServer);
    });

    nextServer.once("error", reject);
  });

  return server;
};

export const stopServer = async () => {
  await closeHttpServer();
  await closeApp();
};

const gracefulShutdown = async (signal, exitCode = 0) => {
  if (!shutdownPromise) {
    shutdownPromise = (async () => {
      const { shutdownTimeoutMs } = getServerConfig();
      const shutdownTimeout = setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
      }, shutdownTimeoutMs);

      if (typeof shutdownTimeout.unref === "function") {
        shutdownTimeout.unref();
      }

      try {
        console.log(`${signal} received. Starting graceful shutdown.`);
        await stopServer();
        clearTimeout(shutdownTimeout);
      } catch (error) {
        clearTimeout(shutdownTimeout);
        console.error("Graceful shutdown failed:", error.message);
        process.exit(1);
      }
    })();
  }

  await shutdownPromise;
  process.exit(exitCode);
};

export const registerProcessHandlers = () => {
  if (processHandlersRegistered) {
    return;
  }

  processHandlersRegistered = true;

  SHUTDOWN_SIGNALS.forEach((signal) => {
    process.on(signal, () => {
      gracefulShutdown(signal).catch((error) => {
        console.error("Shutdown handler failed:", error.message);
        process.exit(1);
      });
    });
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);

    gracefulShutdown("unhandledRejection", 1).catch((error) => {
      console.error("Shutdown after unhandled rejection failed:", error.message);
      process.exit(1);
    });
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);

    gracefulShutdown("uncaughtException", 1).catch((shutdownError) => {
      console.error("Shutdown after uncaught exception failed:", shutdownError.message);
      process.exit(1);
    });
  });
};

export const runServer = async () => {
  registerProcessHandlers();
  return startServer();
};

const isDirectExecution = () => {
  if (!process.argv[1]) {
    return false;
  }

  return import.meta.url === pathToFileURL(process.argv[1]).href;
};

if (isDirectExecution()) {
  runServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

export default app;
