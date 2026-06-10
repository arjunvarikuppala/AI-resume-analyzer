import mongoose from "mongoose";

const spellingErrorSchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    count: { type: Number, default: 1 },
    suggestions: { type: [String], default: [] },
  },
  { _id: false }
);

const grammarErrorSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    shortMessage: { type: String, default: "" },
    sentence: { type: String, default: "" },
    ruleId: { type: String, default: "" },
    replacements: { type: [String], default: [] },
    offset: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
  },
  { _id: false }
);

const scoreBreakdownSchema = new mongoose.Schema(
  {
    sections: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    spelling: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    spellingErrors: {
      type: [spellingErrorSchema],
      default: [],
    },
    grammarErrors: {
      type: [grammarErrorSchema],
      default: [],
    },
    missingSections: {
      type: [String],
      default: [],
    },
    detectedSkills: {
      type: [String],
      default: [],
    },
    formattingIssues: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    analysisWarnings: {
      type: [String],
      default: [],
    },
    sectionScores: {
      type: scoreBreakdownSchema,
      default: () => ({}),
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    recommendedSkills: {
      type: [String],
      default: [],
    },
    projectImprovements: {
      type: [String],
      default: [],
    },
    experienceImprovements: {
      type: [String],
      default: [],
    },
    grammarSuggestions: {
      type: [String],
      default: [],
    },
    overallRecommendation: {
      type: String,
      default: "",
    },
    recommendations: {
      type: [String],
      default: [],
    },
    aiSummary: {
      type: String,
      default: "",
    },
    jobMatchScore: {
      type: Number,
      default: 0,
    },
    jobMatchAnalysis: {
      missingSkills: { type: [String], default: [] },
      missingKeywords: { type: [String], default: [] },
      recommendedImprovements: { type: [String], default: [] },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
