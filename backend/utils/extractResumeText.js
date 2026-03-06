import path from "path";

import mammoth from "mammoth";
import pdfParse from "pdf-parse";

import ApiError from "./ApiError.js";

const normalizeText = (text) =>
  String(text || "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const extractResumeText = async (file) => {
  if (!file?.buffer?.length) {
    throw new ApiError(400, "Uploaded file is empty.");
  }

  const extension = path.extname(file.originalname || "").toLowerCase();

  if (extension === ".pdf") {
    const parsed = await pdfParse(file.buffer);
    const text = normalizeText(parsed.text);

    if (!text) {
      throw new ApiError(422, "Unable to extract text from the uploaded PDF.");
    }

    return text;
  }

  if (extension === ".docx") {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    const text = normalizeText(parsed.value);

    if (!text) {
      throw new ApiError(422, "Unable to extract text from the uploaded DOCX file.");
    }

    return text;
  }

  throw new ApiError(400, "Unsupported file type. Upload a PDF or DOCX file.");
};

export default extractResumeText;
