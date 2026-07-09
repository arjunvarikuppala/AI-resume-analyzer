import api from "./api";

export const getJobs = async () => {
  const { data } = await api.get("/jobs");
  return data.jobs;
};

export const getJobById = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data.job;
};

export const createJob = async (jobData) => {
  const { data } = await api.post("/jobs", jobData);
  return data.job;
};

export const updateJob = async (id, jobData) => {
  const { data } = await api.put(`/jobs/${id}`, jobData);
  return data.job;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};
