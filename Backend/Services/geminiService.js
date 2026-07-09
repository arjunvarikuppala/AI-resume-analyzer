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
  "isResume": true, // Boolean. True if the text represents a valid resume, CV, or professional profile. False if it is a completely unrelated document (e.g., recipe, random article, novel, random characters).
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
            (errorMsg.includes("API key") || 
            errorMsg.includes("API_KEY") || 
            errorMsg.includes("403") || 
            errorMsg.includes("invalid key")) && 
            !errorMsg.includes("429");

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
        (modelSetupError.message.includes("authorization failure") || 
        modelSetupError.message.includes("API key") || 
        modelSetupError.message.includes("API_KEY") || 
        modelSetupError.message.includes("403") || 
        modelSetupError.message.includes("invalid key")) && 
        !modelSetupError.message.includes("429");

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

/**
 * Calculates a semantic match score between a resume and a job description using Gemini text embeddings.
 * @param {string} resumeText - Extracted text of the resume
 * @param {string} jobDescription - Job description text
 * @returns {Promise<number>} Match score from 0 to 100
 */
export const calculateSemanticMatch = async (resumeText, jobDescription, customApiKey = null) => {
  console.log("calculateSemanticMatch called with jobDescription length:", jobDescription?.length);
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("Gemini API key not configured, falling back to basic matching.");
    return fallbackMatch(resumeText, jobDescription);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const [resumeEmb, jobEmb] = await Promise.all([
      model.embedContent(resumeText.slice(0, 5000)), // Limit text length for embedding if needed
      model.embedContent(jobDescription.slice(0, 5000))
    ]);

    const v1 = resumeEmb.embedding.values;
    const v2 = jobEmb.embedding.values;

    // Cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    
    // Scale similarity (usually between -1 and 1) to 0-100
    // In practice, text embeddings are often strictly positive, so similarity is 0 to 1
    const score = Math.max(0, Math.min(100, Math.round(similarity * 100)));
    return score;
  } catch (error) {
    console.error("Error calculating semantic match with Gemini:", error);
    return fallbackMatch(resumeText, jobDescription);
  }
};

const fallbackMatch = (resumeText, jobDescription) => {
  const rWords = new Set(resumeText.toLowerCase().match(/\b\w+\b/g) || []);
  const jWords = new Set(jobDescription.toLowerCase().match(/\b\w+\b/g) || []);
  if (jWords.size === 0) return 0;
  
  let matchCount = 0;
  for (const word of jWords) {
    if (rWords.has(word)) {
      matchCount++;
    }
  }
  return Math.round((matchCount / jWords.size) * 100);
};

