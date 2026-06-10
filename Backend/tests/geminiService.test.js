import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure API key is configured for the module load
process.env.GEMINI_API_KEY = "mock-api-key";

// Import the service
const { analyzeResumeWithAI } = await import("../Services/geminiService.js");

describe("geminiService robust fallback and retry", () => {
  it("should successfully fall back to next model when first model fails with 503", async () => {
    const originalGetGenerativeModel = GoogleGenerativeAI.prototype.getGenerativeModel;

    let calls = [];

    // Override the prototype method to simulate failure and fallback
    GoogleGenerativeAI.prototype.getGenerativeModel = function (config) {
      const modelName = config.model;
      return {
        generateContent: async (prompt) => {
          calls.push(modelName);
          if (modelName === "gemini-3.5-flash") {
            // First model fails with a 503 error
            throw new Error("[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.");
          }
          if (modelName === "gemini-3.1-flash-lite") {
            // Second model succeeds
            return {
              response: {
                text: () => JSON.stringify({
                  atsScore: 90,
                  aiSummary: "Excellent candidate",
                  strengths: ["coding"],
                  weaknesses: ["none"],
                  missingKeywords: [],
                  recommendedSkills: [],
                  projectImprovements: [],
                  experienceImprovements: [],
                  grammarSuggestions: [],
                  overallRecommendation: "Hire them",
                  jobMatchScore: 0,
                  jobMatchAnalysis: {
                    missingSkills: [],
                    missingKeywords: [],
                    recommendedImprovements: []
                  }
                })
              }
            };
          }
          throw new Error("Unexpected model: " + modelName);
        }
      };
    };

    try {
      const result = await analyzeResumeWithAI("Mock resume content", null);
      
      // Assert it tried gemini-3.5-flash twice (1 initial + 1 retry)
      // and then moved to gemini-3.1-flash-lite which succeeded.
      assert.deepEqual(calls, [
        "gemini-3.5-flash",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite"
      ]);
      
      assert.equal(result.atsScore, 90);
      assert.equal(result.aiSummary, "Excellent candidate");
    } finally {
      // Restore original prototype method
      GoogleGenerativeAI.prototype.getGenerativeModel = originalGetGenerativeModel;
    }
  });

  it("should fast fail on auth errors without trying other models", async () => {
    const originalGetGenerativeModel = GoogleGenerativeAI.prototype.getGenerativeModel;

    let calls = [];

    GoogleGenerativeAI.prototype.getGenerativeModel = function (config) {
      const modelName = config.model;
      return {
        generateContent: async (prompt) => {
          calls.push(modelName);
          // Throw API key auth error
          throw new Error("[GoogleGenerativeAI Error]: API key not valid. Please pass a valid API key.");
        }
      };
    };

    try {
      await assert.rejects(
        analyzeResumeWithAI("Mock resume content", null),
        /Gemini API authorization failure/
      );
      
      // Should fail immediately on the first attempt of the first model
      assert.deepEqual(calls, ["gemini-3.5-flash"]);
    } finally {
      GoogleGenerativeAI.prototype.getGenerativeModel = originalGetGenerativeModel;
    }
  });

  it("should use the custom API key when provided", async () => {
    const originalGetGenerativeModel = GoogleGenerativeAI.prototype.getGenerativeModel;

    let constructorApiKey = null;
    
    GoogleGenerativeAI.prototype.getGenerativeModel = function (config) {
      constructorApiKey = this.apiKey;
      return {
        generateContent: async (prompt) => {
          return {
            response: {
              text: () => JSON.stringify({
                atsScore: 95,
                aiSummary: "Valid custom key used",
                strengths: [],
                weaknesses: [],
                missingKeywords: [],
                recommendedSkills: [],
                projectImprovements: [],
                experienceImprovements: [],
                grammarSuggestions: [],
                overallRecommendation: "Yes",
                jobMatchScore: 0,
                jobMatchAnalysis: {
                  missingSkills: [],
                  missingKeywords: [],
                  recommendedImprovements: []
                }
              })
            }
          };
        }
      };
    };

    try {
      const result = await analyzeResumeWithAI("Mock resume content", null, "custom-provided-api-key");
      assert.equal(constructorApiKey, "custom-provided-api-key");
      assert.equal(result.atsScore, 95);
    } finally {
      GoogleGenerativeAI.prototype.getGenerativeModel = originalGetGenerativeModel;
    }
  });
});
