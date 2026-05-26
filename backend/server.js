import { pathToFileURL } from "url";

import app, { closeApp, initializeApp } from "./app.js";
import { getServerConfig } from "./Config/env.js";

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"];

let server;
let processHandlersRegistered = false;
let shutdownPromise;

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

const registerProcessHandlers = () => {
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

const isDirectExecution = () => {
  if (!process.argv[1]) {
    return false;
  }

  return import.meta.url === pathToFileURL(process.argv[1]).href;
};

if (isDirectExecution()) {
  registerProcessHandlers();

  startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}
