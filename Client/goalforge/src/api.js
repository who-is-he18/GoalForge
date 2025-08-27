import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // set to true if backend uses cookies
  // Don't set Content-Type globally (causes issues for GET w/ some Flask configs).
  headers: {
    Accept: "application/json",
  },
});

// 🔑 Automatically attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
