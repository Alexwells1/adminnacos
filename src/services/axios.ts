// src/lib/axios.ts
import axios from "axios";

const BASE_URL = "https://colcom-backend.onrender.com/api";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // For desktop browsers
  timeout: 30000,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    // 🔥 ALWAYS add Authorization header for mobile browsers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
