import api from "./api";

export const applyToJob = async (jobId, resumeId) => {
  const { data } = await api.post("/applications", { jobId, resumeId });
  return data.application;
};

export const getEmployerApplications = async () => {
  const { data } = await api.get("/applications/employer");
  return data.applications;
};

export const getEmployeeApplications = async () => {
  const { data } = await api.get("/applications/employee");
  return data.applications;
};

export const updateApplicationStatus = async (id, status) => {
  const { data } = await api.put(`/applications/${id}/status`, { status });
  return data.application;
};
