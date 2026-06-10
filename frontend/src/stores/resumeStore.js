import { create } from "zustand";

import {
  getResumeById,
  getResumeHistory,
  uploadResume as uploadResumeRequest,
} from "../services/resumeService";

const getErrorMessage = (error) => {
  const msg = (error.message || "").toLowerCase();
  
  if (msg.includes("api key expired") || msg.includes("api_key_invalid") || msg.includes("key expired")) {
    return "🔑 The configured Gemini API key has expired. Please configure a valid personal Gemini API key in the 'Custom Gemini API Key' section below.";
  }
  
  if (msg.includes("429") || msg.includes("quota exceeded") || msg.includes("too many requests") || msg.includes("limit: 0") || msg.includes("resource has been exhausted")) {
    return "⚠️ Gemini API Quota Exceeded. The API key has exceeded its rate limit or daily quota. Please try again later, or configure your own personal Gemini API key in the 'Custom Gemini API Key' section below to bypass this.";
  }
  
  if (msg.includes("503") || msg.includes("service unavailable") || msg.includes("high demand")) {
    return "🌐 Gemini AI service is currently experiencing high demand. Please try again in a few moments.";
  }
  
  if (msg.includes("authorization failure") || msg.includes("api key not valid") || msg.includes("403")) {
    return "🔑 Invalid Gemini API key. Please check the configured API key in the 'Custom Gemini API Key' section below.";
  }

  return error.message || "Something went wrong. Please try again.";
};

export const useResumeStore = create((set) => ({
  history: [],
  latestResume: null,
  selectedResume: null,
  dashboardLoading: true,
  historyLoading: true,
  detailLoading: true,
  uploading: false,
  dashboardError: "",
  historyError: "",
  detailError: "",

  loadDashboard: async () => {
    set({ dashboardLoading: true, dashboardError: "" });

    try {
      const historyResponse = await getResumeHistory();
      const history = historyResponse.resumes || [];
      let latestResume = null;

      if (history.length) {
        const latestResponse = await getResumeById(history[0]._id);
        latestResume = latestResponse.resume;
      }

      set({
        history,
        latestResume,
        dashboardLoading: false,
      });
    } catch (error) {
      set({
        dashboardError: getErrorMessage(error),
        dashboardLoading: false,
      });
    }
  },

  uploadResume: async (file, jobDescription) => {
    set({ uploading: true, dashboardError: "" });

    try {
      const uploadResponse = await uploadResumeRequest(file, jobDescription);
      const historyResponse = await getResumeHistory();

      set({
        latestResume: uploadResponse.resume,
        history: historyResponse.resumes || [],
        uploading: false,
      });

      return uploadResponse.resume;
    } catch (error) {
      set({
        dashboardError: getErrorMessage(error),
        uploading: false,
      });
      return null;
    }
  },

  loadHistory: async () => {
    set({ historyLoading: true, historyError: "" });

    try {
      const response = await getResumeHistory();
      set({
        history: response.resumes || [],
        historyLoading: false,
      });
    } catch (error) {
      set({
        historyError: getErrorMessage(error),
        historyLoading: false,
      });
    }
  },

  loadResume: async (id) => {
    set({ selectedResume: null, detailLoading: true, detailError: "" });

    try {
      const response = await getResumeById(id);
      set({
        selectedResume: response.resume,
        detailLoading: false,
      });
    } catch (error) {
      set({
        detailError: getErrorMessage(error),
        detailLoading: false,
      });
    }
  },

  clearResumeData: () => {
    set({
      history: [],
      latestResume: null,
      selectedResume: null,
      dashboardLoading: true,
      historyLoading: true,
      detailLoading: true,
      uploading: false,
      dashboardError: "",
      historyError: "",
      detailError: "",
    });
  },
}));
