import authRoutes from "./auth/authRoutes.js";
import resumeRoutes from "./resume/resumeRoutes.js";

export const registerApiRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);

  app.get("/api/debug/env", (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.status(200).json({
      geminiConfigured: !!(apiKey && apiKey !== "your_gemini_api_key_here"),
    });
  });
};
