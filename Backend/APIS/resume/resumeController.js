import mongoose from "mongoose";

import Resume from "../../Models/Resume.js";
import { analyzeResumeWithAI } from "../../Services/geminiService.js";
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

  const { jobDescription } = req.body;
  const customApiKey = req.headers["x-gemini-api-key"];

  const analysis = await analyzeResumeWithAI(resumeText, jobDescription || null, customApiKey || null);

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype || "application/octet-stream",
    fileSize: req.file.size,
    resumeText,
    score: analysis.atsScore, // Sync main score with ATS score for compatibility
    atsScore: analysis.atsScore,
    aiSummary: analysis.aiSummary,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    missingKeywords: analysis.missingKeywords,
    recommendedSkills: analysis.recommendedSkills,
    projectImprovements: analysis.projectImprovements,
    experienceImprovements: analysis.experienceImprovements,
    grammarSuggestions: analysis.grammarSuggestions,
    overallRecommendation: analysis.overallRecommendation,
    recommendations: analysis.projectImprovements.concat(analysis.experienceImprovements).concat(analysis.grammarSuggestions),
    jobMatchScore: analysis.jobMatchScore || 0,
    jobMatchAnalysis: analysis.jobMatchAnalysis || {
      missingSkills: [],
      missingKeywords: [],
      recommendedImprovements: [],
    },
    
    // Maintain old fields with sensible defaults for backward compatibility
    missingSkills: analysis.jobMatchAnalysis?.missingSkills || analysis.recommendedSkills || [],
    spellingErrors: [],
    grammarErrors: [],
    missingSections: [],
    detectedSkills: analysis.recommendedSkills || [],
    formattingIssues: [],
    suggestions: analysis.projectImprovements || [],
    analysisWarnings: [],
    sectionScores: {
      sections: 100,
      grammar: 100,
      spelling: 100,
      skills: 100,
      formatting: 100,
    },
  });

  res.status(201).json({
    message: "Resume uploaded and analyzed successfully using Gemini AI.",
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
      "fileName score atsScore missingSkills missingSections detectedSkills formattingIssues strengths weaknesses aiSummary jobMatchScore createdAt"
    );

  res.status(200).json({
    count: resumes.length,
    resumes,
  });
});
