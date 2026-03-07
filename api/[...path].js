import app, { initializeApp } from "../backend/app.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error("Failed to initialize API function:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Server failed to initialize.",
      });
    }
  }
}
