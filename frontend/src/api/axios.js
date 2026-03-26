import axios from "axios";

const API = axios.create({ baseURL: "https://job-portal-project-7tud.onrender.com/api" });


// Attach JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auto-logout on 401/403
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────
export const login = (data) => API.post("/users/login", data);
export const register = (data) => API.post("/users/register", data);

// ── Jobs ──────────────────────────────────────────
export const getJobs = () => API.get("/jobs");
export const createJob = (data) => API.post("/jobs", data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// ── Applications ──────────────────────────────────
export const applyForJob = (jobId) => API.post(`/applications/apply/${jobId}`);
export const getMyApplications = () => API.get("/applications/my");
export const getApplicationsForJob = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (appId, status) =>
  API.put(`/applications/${appId}/status?status=${status}`);

export default API;
export const getMyJobs = () => API.get("/jobs/my-jobs");