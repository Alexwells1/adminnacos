// src/lib/axios.ts
import axios from "axios";

const BASE_URL = "https://colcom-backend.onrender.com/api";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Enhanced request interceptor for mobile browser compatibility
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    // For mobile browsers that block cookies, we'll use dual strategy
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure credentials are always included
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear all auth data
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
