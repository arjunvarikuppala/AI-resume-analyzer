import api from "./api";

export const uploadResume = async (file, jobDescription = "") => {
  const formData = new FormData();
  formData.append("resume", file);
  if (jobDescription) {
    formData.append("jobDescription", jobDescription);
  }

  const response = await api.post("/resume/upload", formData);
  return response.data;
};

export const getResumeHistory = async () => {
  const response = await api.get("/resume/history");
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await api.get(`/resume/${id}`);
  return response.data;
};
