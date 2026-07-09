import api from "./api";

export const uploadResume = async (file, jobDescription = "") => {
  const formData = new FormData();
  if (jobDescription) {
    formData.append("jobDescription", jobDescription);
  }
  formData.append("resume", file);

  const response = await api.post("/resume/upload", formData);
  return response.data;
};

export const uploadBulkResumes = async (files, jobDescription = "") => {
  const formData = new FormData();
  if (jobDescription) {
    formData.append("jobDescription", jobDescription);
  }
  for (let i = 0; i < files.length; i++) {
    formData.append("resumes", files[i]);
  }

  const response = await api.post("/resume/upload-bulk", formData);
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
