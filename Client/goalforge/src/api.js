import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  // if you plan to use cookie auth (httpOnly cookies), set withCredentials: true
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// optional: request interceptor to attach a token later
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
