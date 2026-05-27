import ApiError from "../utils/ApiError.js";

const splitOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const escapeRegex = (value) => value.replace(/[|\\{}()[\]^$+?.*]/g, "\\$&");

export const normalizeOrigin = (origin) => String(origin || "").trim().replace(/\/+$/, "");

export const getAllowedOriginPatterns = () =>
  [...new Set([process.env.CORS_ORIGINS, process.env.CLIENT_URL, process.env.FRONTEND_URL].flatMap(splitOrigins))];

export const createOriginMatcher = (pattern) => {
  const normalizedPattern = normalizeOrigin(pattern);

  if (!normalizedPattern) {
    return () => false;
  }

  if (!normalizedPattern.includes("*")) {
    return (origin) => normalizeOrigin(origin) === normalizedPattern;
  }

  const wildcardRegex = new RegExp(
    `^${escapeRegex(normalizedPattern).replace(/\\\*/g, "[^/]+")}$`
  );

  return (origin) => wildcardRegex.test(normalizeOrigin(origin));
};

export const isOriginAllowed = (origin, patterns = getAllowedOriginPatterns()) => {
  if (!origin) {
    return true;
  }

  if (!patterns.length) {
    return true;
  }

  return patterns.some((pattern) => createOriginMatcher(pattern)(origin));
};

export const getCorsOptions = () => {
  const allowedOrigins = getAllowedOriginPatterns();

  if (!allowedOrigins.length) {
    return { origin: true, credentials: true };
  }

  return {
    credentials: true,
    origin: (origin, callback) => {
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }

      callback(new ApiError(403, "Origin is not allowed by CORS."));
    },
  };
};
