import mongoose from "mongoose";

import Resume from "../../models/Resume.js";
import { analyzeResume } from "../../services/resumeAnalysisService.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import extractResumeText from "../../utils/extractResumeText.js";

const ensureResumeFile = (req) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a PDF or DOCX resume.");
  }
};

const ensureResumeHasEnoughContent = (resumeText) => {
  if (resumeText.split(/\s+/).length < 20) {
    throw new ApiError(422, "The uploaded file does not contain enough resume content to analyze.");
  }
};

export const uploadResume = asyncHandler(async (req, res) => {
  ensureResumeFile(req);

  const resumeText = await extractResumeText(req.file);
  ensureResumeHasEnoughContent(resumeText);

  const analysis = await analyzeResume(resumeText);

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype || "application/octet-stream",
    fileSize: req.file.size,
    resumeText,
    score: analysis.score,
    atsScore: analysis.atsScore,
    missingSkills: analysis.missingSkills,
    spellingErrors: analysis.spellingErrors,
    grammarErrors: analysis.grammarErrors,
    missingSections: analysis.missingSections,
    detectedSkills: analysis.detectedSkills,
    formattingIssues: analysis.formattingIssues,
    suggestions: analysis.suggestions,
    analysisWarnings: analysis.analysisWarnings,
    sectionScores: analysis.sectionScores,
  });

  res.status(201).json({
    message: "Resume uploaded and analyzed successfully.",
    resume,
  });
});

export const getResumeById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, "Resume id is invalid.");
  }

  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume analysis not found.");
  }

  res.status(200).json({ resume });
});

export const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select(
      "fileName score atsScore missingSkills missingSections detectedSkills formattingIssues createdAt"
    );

  res.status(200).json({
    count: resumes.length,
    resumes,
  });
});
