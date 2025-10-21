import axios from "./axios";
import type {
  // Core Types
  Admin,
  Payment,
  Expense,
  Executive,
  FinancialStats,
  DashboardStats,
  PaymentTypeEnum,
  ExpenseTypeEnum,

  // API Response Types
  LoginResponse,
  PaginatedResponse,

  // Filter Types
  PaymentFilters,
  UpdateAdminData,
  CreatePaymentData,
  CreateExpenseData,
  CreateExecutiveData,
  CreateAdminData,
} from "@/types/admin.types";

// Re-export types for convenience
export type {
  Admin,
  Payment,
  Expense,
  Executive,
  FinancialStats,
  DashboardStats,
  PaymentFilters,
  PaymentTypeEnum as PaymentType,
  ExpenseTypeEnum as ExpenseType,
};

// Auth Service
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(
      "/auth/logout"
    );
    return response.data;
  },

  getProfile: async (): Promise<{ admin: Admin }> => {
    const response = await axios.get<{ admin: Admin }>("/auth/profile");
    return response.data;
  },

  updateProfile: async (updates: {
    name?: string;
    email?: string;
  }): Promise<{ admin: Admin }> => {
    const response = await axios.put<{ admin: Admin }>(
      "/auth/profile",
      updates
    );
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await axios.patch<{ message: string }>(
      "/admin/auth/profile/password",
      {
        currentPassword,
        newPassword,
      }
    );
    return response.data;
  },
};

// Admin Management Service
export const adminManagementService = {
  registerAdmin: async (
    adminData: CreateAdminData
  ): Promise<{ admin: Admin }> => {
    const response = await axios.post<{ admin: Admin }>(
      "/admin/management/register",
      adminData
    );
    return response.data;
  },

  getAllAdmins: async (): Promise<{ admins: Admin[] }> => {
    const response = await axios.get<{ admins: Admin[] }>("/admin/management");
    return response.data;
  },

  updateAdmin: async (
    id: string,
    updates: UpdateAdminData
  ): Promise<{ admin: Admin }> => {
    const response = await axios.put<{ admin: Admin }>(
      `/admin/management/${id}`,
      updates
    );
    return response.data;
  },

  toggleAdminStatus: async (id: string): Promise<{ admin: Admin }> => {
    const response = await axios.patch<{ admin: Admin }>(
      `/admin/management/${id}/toggle-status`
    );
    return response.data;
  },

  deleteAdmin: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(
      `/admin/management/${id}`
    );
    return response.data;
  },

  changeAdminPassword: async (
    id: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await axios.patch<{ message: string }>(
      `/admin/management/${id}/password`,
      {
        newPassword,
      }
    );
    return response.data;
  },
};

// Dashboard Service
export const dashboardService = {
  getSuperAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<DashboardStats>(
      "/admin/stats/super-admin"
    );
    return response.data;
  },

  getCollegeAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<DashboardStats>(
      "/admin/stats/college-admin"
    );
    return response.data;
  },

  getDepartmentalAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<DashboardStats>(
      "/admin/stats/departmental-admin"
    );
    return response.data;
  },

  getGeneralAdminStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<DashboardStats>(
      "/admin/stats/general-admin"
    );
    return response.data;
  },

  getFinancialStats: async (): Promise<FinancialStats> => {
    const response = await axios.get<FinancialStats>("/admin/financial/stats");
    return response.data;
  },
};

// Financial Service
export const financialService = {
  getFinancialStats: async (): Promise<FinancialStats> => {
    const response = await axios.get<FinancialStats>("/admin/financial/stats");
    return response.data;
  },

  recalculateFinancialStats: async (): Promise<{
    message: string;
    stats?: FinancialStats;
  }> => {
    const response = await axios.post<{
      message: string;
      stats?: FinancialStats;
    }>("/admin/financial/recalculate");
    return response.data;
  },

  getExpenses: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Expense>> => {
    const response = await axios.get<PaginatedResponse<Expense>>(
      "/admin/expenses",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  createExpense: async (
    expenseData: CreateExpenseData
  ): Promise<{ expense: Expense }> => {
    const response = await axios.post<{ expense: Expense }>(
      "/admin/expenses",
      expenseData
    );
    return response.data;
  },

  deleteExpense: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(
      `/admin/expenses/${id}`
    );
    return response.data;
  },
};

// Payment Service
export const paymentService = {
  getPayments: async (
    filters: PaymentFilters = {}
  ): Promise<PaginatedResponse<Payment>> => {
    const response = await axios.get<PaginatedResponse<Payment>>(
      "/admin/payments",
      {
        params: filters,
      }
    );
    return response.data;
  },

  searchPayments: async (
    query: string
  ): Promise<{ results: Payment[]; count: number }> => {
    const response = await axios.get<{ results: Payment[]; count: number }>(
      "/admin/payments/search",
      {
        params: { q: query },
      }
    );
    return response.data;
  },

  createManualPayment: async (
    paymentData: CreatePaymentData
  ): Promise<{ message: string; payment: Payment }> => {
    const response = await axios.post<{ message: string; payment: Payment }>(
      "/admin/payments/manual",
      paymentData
    );
    return response.data;
  },

  updatePayment: async (
    id: string,
    updates: Partial<CreatePaymentData>
  ): Promise<{ message: string; payment: Payment }> => {
    const response = await axios.put<{ message: string; payment: Payment }>(
      `/admin/payments/${id}`,
      updates
    );
    return response.data;
  },

  deletePayment: async (
    id: string
  ): Promise<{ message: string; payment: Payment }> => {
    const response = await axios.delete<{ message: string; payment: Payment }>(
      `/admin/payments/${id}`
    );
    return response.data;
  },

  exportPaymentsCSV: async (): Promise<Blob> => {
    const response = await axios.get("/admin/payments/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },

  exportPaymentsPDF: async (): Promise<Blob> => {
    const response = await axios.get("/admin/payments/export/pdf", {
      responseType: "blob",
    });
    return response.data;
  },
};

// Receipt Service
export const receiptService = {
  regenerateReceipt: async (
    reference: string
  ): Promise<{ message: string; receiptUrl: string }> => {
    const response = await axios.post<{ message: string; receiptUrl: string }>(
      `/admin/receipts/${reference}/regenerate`
    );
    return response.data;
  },

  getReceiptPDF: async (reference: string): Promise<Blob> => {
    const response = await axios.get(`/api/payment/${reference}/receipt`, {
      responseType: "blob",
    });
    return response.data;
  },

  resendReceiptEmail: async (
    reference: string
  ): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(
      `/admin/receipts/${reference}/resend`
    );
    return response.data;
  },
};

// Executive Service
export const executiveService = {
  addExecutive: async (
    executiveData: CreateExecutiveData
  ): Promise<{ message: string; executive: Executive }> => {
    const response = await axios.post<{
      message: string;
      executive: Executive;
    }>("/admin/executives", executiveData);
    return response.data;
  },

  removeExecutive: async (
    matricNumber: string
  ): Promise<{ message: string; executive: Executive }> => {
    const response = await axios.delete<{
      message: string;
      executive: Executive;
    }>(`/admin/executives/${matricNumber}`);
    return response.data;
  },

  listExecutives: async (): Promise<Executive[]> => {
    const response = await axios.get<Executive[]>("/admin/executives");
    return response.data;
  },
};

// Utility function to download blob files
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Main admin service object
const adminService = {
  auth: authService,
  management: adminManagementService,
  dashboard: dashboardService,
  financial: financialService,
  payments: paymentService,
  receipts: receiptService,
  executives: executiveService,
  utils: {
    downloadBlob,
  },
};

export default adminService;
