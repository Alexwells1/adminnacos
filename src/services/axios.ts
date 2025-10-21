// src/lib/axios.ts
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000, 
});

// Request interceptor - add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
