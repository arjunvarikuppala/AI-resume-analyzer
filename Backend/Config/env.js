import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEFAULT_PORT = 5000;
const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_JSON_BODY_LIMIT = "1mb";
const DEFAULT_SHUTDOWN_TIMEOUT_MS = 10000;
const DEFAULT_MONGO_SERVER_SELECTION_TIMEOUT_MS = 10000;

const parsePositiveNumber = (value, fallback) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const parseTrustProxy = (value) => {
  if (value === undefined || value === null || value === "") {
    return 1;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : value;
};

export const getNodeEnv = () => process.env.NODE_ENV || "development";

export const ensureRuntimeConfig = () => {
  const missing = ["JWT_SECRET"].filter((key) => !process.env[key]);

  if (!process.env.MONGO_URI) {
    missing.push("MONGO_URI");
  }

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

export const getServerConfig = () => ({
  host: process.env.HOST || DEFAULT_HOST,
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || DEFAULT_JSON_BODY_LIMIT,
  port: parsePositiveNumber(process.env.PORT, DEFAULT_PORT),
  shutdownTimeoutMs: parsePositiveNumber(
    process.env.SHUTDOWN_TIMEOUT_MS,
    DEFAULT_SHUTDOWN_TIMEOUT_MS
  ),
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
});

export const getMongoConnectionOptions = () => ({
  serverSelectionTimeoutMS: parsePositiveNumber(
    process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS,
    DEFAULT_MONGO_SERVER_SELECTION_TIMEOUT_MS
  ),
});
