import axios from "axios";

const TOKEN_KEY = "ai_resume_token";
const USER_KEY = "ai_resume_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("auth:expired"));
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Request failed. Check that the backend server is running.";

    const apiError = new Error(message);
    apiError.details = error.response?.data?.details || [];

    return Promise.reject(apiError);
  }
);

export default api;
