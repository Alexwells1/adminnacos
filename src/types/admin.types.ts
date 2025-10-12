// src/types/admin.types.ts
export interface Admin {
  _id: string;
  email: string;
  name: string;
  role: "super_admin" | "college_admin" | "dept_admin" | "general_admin";
  department?: string;
  permissions: {
    canViewPayments: boolean;
    canExportData: boolean;
    canManageAdmins: boolean;
    canViewAnalytics: boolean;
  };
  isActive: boolean;
}

export interface Payment {
  _id: string;
  fullName: string;
  matricNumber: string;
  department: string;
  level: string;
  amount: number;
  type: "college" | "departmental";
  reference: string;
  email?: string;
  phoneNumber?: string;
  isExecutive: boolean;
  scope?: string;
  paidAt: string;
  createdBy: string;
  receiptPdf?: string;
}

export interface Executive {
  _id: string;
  fullName: string;
  matricNumber: string;
  scope: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPayments?: number;
  totalRevenue?: number;
  collegeVsDeptRevenue?: Array<{ _id: string; revenue: number; count: number }>;
  departmentBreakdown?: Array<{ _id: string; revenue: number; count: number }>;
  levelBreakdown?: Array<{ _id: string; revenue: number; count: number }>;
  executiveVsRegular?: Array<{ _id: boolean; revenue: number; count: number }>;
  dailyTrends?: Array<{ _id: string; revenue: number; count: number }>;

  // College admin specific
  totalCollegePayments?: number;
  totalCollegeRevenue?: number;
  levelWisePayments?: Array<{ _id: string; revenue: number; count: number }>;
  executiveVsRegularCollege?: Array<{
    _id: boolean;
    revenue: number;
    count: number;
  }>;
  recentPayments?: Payment[];

  // Departmental admin specific
  totalDeptPayments?: number;
  totalDeptRevenue?: number;
  levelWiseDept?: Array<{ _id: string; revenue: number; count: number }>;
  recentDeptPayments?: Payment[];
  departmentStudents?: Payment[];
  department?: string;
}

export interface PaginatedResponse<T> {
  payments: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    type?: string;
    department?: string;
  };
}
