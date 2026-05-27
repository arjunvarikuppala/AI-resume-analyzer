import authRoutes from "./auth/authRoutes.js";
import resumeRoutes from "./resume/resumeRoutes.js";

export const registerApiRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);
};
