import { create } from "zustand";

import {
  getResumeById,
  getResumeHistory,
  uploadResume as uploadResumeRequest,
} from "../services/resumeService";

const getErrorMessage = (error) => error.message || "Something went wrong. Please try again.";

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

  uploadResume: async (file) => {
    set({ uploading: true, dashboardError: "" });

    try {
      const uploadResponse = await uploadResumeRequest(file);
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
