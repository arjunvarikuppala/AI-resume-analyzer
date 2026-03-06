import path from "path";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORTED_EXTENSIONS = new Set([".pdf", ".docx"]);
const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const isValidEmail = (email) => EMAIL_REGEX.test(String(email || "").trim());

export const validateAuthPayload = ({ email, password }) => {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  return errors;
};

export const isSupportedResumeFile = (file) => {
  if (!file) {
    return false;
  }

  const extension = path.extname(file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  return SUPPORTED_EXTENSIONS.has(extension) || SUPPORTED_MIME_TYPES.has(mimeType);
};
