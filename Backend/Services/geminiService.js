import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyzes resume text using Gemini AI, optionally matching it against a job description.
 * @param {string} resumeText - Extracted text of the resume
 * @param {string|null} jobDescription - Optional job description text
 * @param {string|null} customApiKey - Optional custom Gemini API key provided by the user
 * @returns {Promise<object>} JSON-structured analysis
 */
export const analyzeResumeWithAI = async (resumeText, jobDescription = null, customApiKey = null) => {
  const activeApiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!activeApiKey || activeApiKey === "your_gemini_api_key_here") {
    throw new Error("Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file or provide a custom key.");
  }

  const activeGenAI = new GoogleGenerativeAI(activeApiKey);

  let prompt = `
You are an expert ATS (Applicant Tracking System) and professional resume builder.
Analyze the following resume text and provide a detailed evaluation.

RESUME TEXT:
"""
${resumeText}
"""
`;

  if (jobDescription) {
    prompt += `
Additionally, compare this resume against the following job description:
JOB DESCRIPTION:
"""
${jobDescription}
"""
`;
  }

  prompt += `
Provide the analysis in the following JSON format. Ensure all array fields have relevant text strings and the scores are integers between 0 and 100:

{
  "atsScore": 85, // ATS Score (0-100) based on content structure, section completeness, formatting suggestions, and skill matching
  "aiSummary": "...", // A professional 2-3 sentence summary of the resume's overall profile
  "strengths": ["...", "..."], // Array of 3-5 key professional strengths found in the resume
  "weaknesses": ["...", "..."], // Array of 3-5 weaknesses or areas for improvement in the resume
  "missingKeywords": ["...", "..."], // General industry keywords/buzzwords missing but relevant for this profile
  "recommendedSkills": ["...", "..."], // Specific technical/hard or soft skills recommended to add
  "projectImprovements": ["...", "..."], // Suggestions to improve projects (e.g. quantifying impact, adding technologies)
  "experienceImprovements": ["...", "..."], // Suggestions to improve work experience descriptions (e.g. action verbs, metrics)
  "grammarSuggestions": ["...", "..."], // Specific grammar, syntax, or tone improvement suggestions
  "overallRecommendation": "...", // 1-2 sentence overall recommendation for the candidate
  "jobMatchScore": 0, // Match percentage (0-100) comparing the resume to the Job Description (only populate if Job Description was provided, else 0)
  "jobMatchAnalysis": { // Only populate if Job Description was provided, otherwise set fields to empty arrays
    "missingSkills": ["...", "..."], // Skills mentioned in Job Description but missing/weak in resume
    "missingKeywords": ["...", "..."], // Key terms/concepts from Job Description missing in resume
    "recommendedImprovements": ["...", "..."] // Tailoring recommendations to better fit this specific job description
  }
}
`;

  const candidateModels = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-1.5-flash",
    "gemini-3.1-pro",
    "gemini-1.5-pro",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-pro",
    "gemini-flash-latest",
    "gemini-pro-latest"
  ];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = activeGenAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });

      const maxRetries = 2; // 2 attempts per model (1 initial + 1 retry)
      let retryDelay = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Analyzing resume using Gemini model ${modelName} (Attempt ${attempt}/${maxRetries})...`);
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const parsedData = JSON.parse(responseText);
          return parsedData;
        } catch (error) {
          lastError = error;
          const errorMsg = error.message || "";

          // Fast fail on auth/configuration errors since retrying won't help
          const isAuthError = 
            errorMsg.includes("API key") || 
            errorMsg.includes("API_KEY") || 
            errorMsg.includes("403") || 
            errorMsg.includes("invalid key");

          if (isAuthError) {
            console.error(`Auth/Configuration error on model ${modelName}:`, error);
            throw new Error("Gemini API authorization failure: " + errorMsg);
          }

          const isTransient = 
            errorMsg.includes("503") || 
            errorMsg.includes("429") || 
            errorMsg.includes("Service Unavailable") || 
            errorMsg.includes("Too Many Requests") ||
            errorMsg.includes("high demand") ||
            errorMsg.includes("Resource has been exhausted") ||
            errorMsg.includes("fetch failed");

          if (isTransient && attempt < maxRetries) {
            console.warn(`Gemini API returned transient error for ${modelName} (Attempt ${attempt}/${maxRetries}): ${errorMsg}. Retrying in ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            retryDelay *= 2;
            continue;
          }

          // Otherwise log and try the next model
          console.warn(`Model ${modelName} failed on attempt ${attempt}. Error: ${errorMsg}. Trying next fallback model...`);
          break; // break the retry loop to try the next model
        }
      }
    } catch (modelSetupError) {
      const isAuthError = 
        modelSetupError.message.includes("authorization failure") || 
        modelSetupError.message.includes("API key") || 
        modelSetupError.message.includes("API_KEY") || 
        modelSetupError.message.includes("403") || 
        modelSetupError.message.includes("invalid key");

      if (isAuthError) {
        throw modelSetupError;
      }

      console.warn(`Failed to initialize or run model ${modelName}:`, modelSetupError);
      lastError = modelSetupError;
    }
  }

  console.error("All Gemini models failed to analyze resume. Last error:", lastError);
  throw new Error("Failed to analyze resume using Gemini AI after trying multiple models: " + (lastError?.message || "Unknown error"));
};
