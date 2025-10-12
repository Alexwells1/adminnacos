// src/services/admin.service.ts
import axios from "../lib/axios";
import type { DashboardStats, PaginatedResponse, Payment, Executive, Admin } from "../types/admin.types";


// Auth services
export const adminAuthService = {
  login: async (email: string, password: string) => {
    const response = await axios.post("/admin/auth/login", { email, password });
    return response.data;
  },

  register: async (adminData: any) => {
    const response = await axios.post("/admin/auth/register", adminData);
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get("/admin/auth/profile");
    return response.data;
  },

  logout: async () => {
    const response = await axios.post("/admin/auth/logout");
    return response.data;
  },

  updateAdmin: async (id: string, updates: any) => {
    const response = await axios.put(`/admin/auth/admin/${id}`, updates);
    return response.data;
  },
};

// Dashboard services
export const dashboardService = {
  getSuperAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get("/admin/stats/super-admin");
    return response.data;
  },

  getCollegeAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get("/admin/stats/college-admin");
    return response.data;
  },

  getDepartmentalAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get("/admin/stats/departmental-admin");
    return response.data;
  },
};

// Payment services
export const paymentService = {
  getPayments: async (params?: any): Promise<PaginatedResponse<Payment>> => {
    const response = await axios.get("/admin/payments", { params });
    return response.data;
  },

  searchPayments: async (query: string) => {
    const response = await axios.get("/admin/payments/search", {
      params: { q: query },
    });
    return response.data;
  },

  createManualPayment: async (paymentData: any) => {
    const response = await axios.post("/admin/payments/manual", paymentData);
    return response.data;
  },

  updatePayment: async (id: string, updates: any) => {
    const response = await axios.put(`/admin/payments/${id}`, updates);
    return response.data;
  },

  deletePayment: async (id: string) => {
    const response = await axios.delete(`/admin/payments/${id}`);
    return response.data;
  },

  exportCSV: async () => {
    const response = await axios.get("/admin/payments/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },

  exportPDF: async () => {
    const response = await axios.get("/admin/payments/export/pdf", {
      responseType: "blob",
    });
    return response.data;
  },
};

// Executive services
export const executiveService = {
  listExecutives: async (): Promise<Executive[]> => {
    const response = await axios.get("/admin/executives");
    return response.data;
  },

  addExecutive: async (executiveData: any) => {
    const response = await axios.post("/admin/executives", executiveData);
    return response.data;
  },

  removeExecutive: async (matricNumber: string) => {
    const response = await axios.delete(`/admin/executives/${matricNumber}`);
    return response.data;
  },
};

// Admin management services (Super admin only)
export const adminManagementService = {
  getAllAdmins: async (): Promise<Admin[]> => {
    const response = await axios.get("/admin/management/admins");
    return response.data;
  },

  toggleAdminStatus: async (id: string) => {
    const response = await axios.patch(`/admin/management/admins/${id}/toggle`);
    return response.data;
  },
};

// Receipt services
export const receiptService = {
  regenerateReceipt: async (reference: string) => {
    const response = await axios.post(
      `/admin/receipts/${reference}/regenerate`
    );
    return response.data;
  },

  resendReceiptEmail: async (reference: string) => {
    const response = await axios.post(`/admin/receipts/${reference}/resend`);
    return response.data;
  },
};
