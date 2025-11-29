import type { SetStateAction } from "react";

// Base Types
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Types
export interface AdminPermissions {
  canViewPayments: boolean;
  canExportData: boolean;
  canManageAdmins: boolean;
  canViewAnalytics: boolean;
}

// In your frontend types (admin.types.ts)
export interface Admin extends BaseEntity {
  email: string;
  name: string;
  role:
    | "super_admin"
    | "college_admin"
    | "dept_admin" // Changed from "departmental_admin"
    | "director_finance"
    | "general_admin"; // Added missing role
  department?:
    | "Computer Science"
    | "ICT & Information Technology"
    | "Cybersecurity & Data Science"
    | "Software Engr & Information Systems";
  permissions: AdminPermissions;
  isActive: boolean;
}

// Payment Types
export type PaymentDepartment =
  | "Computer Science"
  | "ICT & Information Technology"
  | "Cybersecurity & Data Science"
  | "Software Engr & Information Systems";
export type PaymentTypeEnum = "college" | "departmental"; // Renamed to avoid conflict
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

// In your frontend types (admin.types.ts)
export interface Payment extends BaseEntity {
  fullName: string;
  matricNumber: string;
  department: PaymentDepartment;
  level: string;
  amount: number;
  type: PaymentTypeEnum;
  reference: string;
  email?: string;
  phoneNumber?: string;
  isExecutive: boolean;
  scope?: string;
  paidAt: string;
  createdBy?: Admin | string;
  receiptPdf?: string;
  status: PaymentStatus;
}

// Fix the enum naming conflict
export type PaymentType = "college" | "departmental";
export type ExpenseType = "college" | "departmental";



// Executive Types
export interface Executive extends BaseEntity {
  fullName: string;
  matricNumber: string;
  scope: string;
}

// Account Stats Types
export interface AccountStats {
  grossRevenue: any;
  totalRevenue: number;
  paymentCount: number;
  maintenanceCollected: number;
  expenses: number;
  expenseCount: number;
  availableBalance: number;
  lastUpdated: string;
  _id: string;
}

// Financial Stats Types
export interface FinancialAccounts {
  college_general: AccountStats;
  dept_comssa: AccountStats;
  dept_icitsa: AccountStats;
  dept_cydasa: AccountStats;
  dept_senifsa: AccountStats;
}

export interface FinancialStats extends BaseEntity {
  grossTotalRevenue: number;
  executivePaymentsSkipped: number;
  accounts: FinancialAccounts;
  totalMaintenance: number;
  grossCollegeRevenue: number;
  grossDepartmentalRevenue: number;
  maintenanceExpenses: number;
  availableMaintenance: number;
  totalCollegeRevenue: number;
  totalDepartmentalRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  lastUpdated: string;
  departmentalAccounts?: {
    [key: string]: number;
  };
  availableBalance?: number;
  totalIncome?: number;
}

// Dashboard Stats Types
export interface RevenueBreakdown {
  _id: string;
  revenue: number;
  count: number;
}

export interface DetailedDepartmentBreakdown {
  _id: {
    department: string;
    level: string;
    type: string;
  };
  revenue: number;
  count: number;
}

export interface LevelTypeBreakdown {
  _id: {
    level: string;
    type: string;
  };
  revenue: number;
  count: number;
}

export interface DepartmentLevelCounts {
  _id: {
    department: string;
    level: string;
  };
  count: number;
  revenue: number;
}

export interface DailyTrend {
  _id: string;
  revenue: number;
  count: number;
}

export interface ExecutiveVsRegular {
  _id: boolean;
  revenue: number;
  count: number;
}

export interface DashboardStats {
  executivePaymentsSkipped: any;
  grossTotalRevenue: any;
  // Core metrics
  totalPayments: number;
  totalRevenue: number;

  // Breakdowns from backend
  collegeVsDeptRevenue?: RevenueBreakdownItem[];
  departmentBreakdown?: RevenueBreakdownItem[];
  levelBreakdown?: RevenueBreakdownItem[];
  executiveVsRegular?: RevenueBreakdownItem[];
  dailyTrends?: DailyTrendItem[];
  detailedDepartmentBreakdown?: DetailedDepartmentItem[];
  levelTypeBreakdown?: LevelTypeItem[];
  departmentLevelCounts?: DepartmentLevelItem[];

  // Financial stats
  financialStats?: FinancialStats;

  // Role-specific data
  totalCollegePayments?: number;
  totalCollegeRevenue?: number;
  levelWisePayments?: RevenueBreakdownItem[];
  executiveVsRegularCollege?: RevenueBreakdownItem[];
  recentPayments?: Payment[];

  totalDeptPayments?: number;
  totalDeptRevenue?: number;
  levelWiseDept?: RevenueBreakdownItem[];
  recentDeptPayments?: Payment[];
  departmentStudents?: Payment[];
  department?: string;

  // Access info
  accessedBy?: { role: string; name: string };
}


export interface RevenueBreakdownItem {
  _id: string | boolean | null;
  revenue: number;
  count: number;
}
export interface BreakdownItem {
  _id: string;
  revenue: number;
  count: number;
}

export interface ExecutiveVsRegularItem {
  _id: boolean;
  revenue: number;
  count: number;
}


export interface DepartmentLevelItem {
  _id: {
    department: string;
    level: string;
  };
  count: number;
  revenue: number;
}

export interface LevelTypeItem {
  _id: {
    level: string;
    type: string;
  };
  revenue: number;
  count: number;
}

export interface DetailedDepartmentItem {
  _id: {
    department: string;
    level: string;
    type: string;
  };
  revenue: number;
  count: number;
}

export interface DailyTrendItem {
  _id: string; // date string
  revenue: number;
  count: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginResponse {
  message: string;
  admin: Admin;
  token: string; 
}

export interface StatsResponse {
  stats: DashboardStats;
}

// Filter Types
export interface PaymentFilters {
  page?: number;
  limit?: number;
  sort?: string;
  type?: PaymentTypeEnum;
  department?: PaymentDepartment;
  level?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
}

// Form Data Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterAdminData {
  email: string;
  password: string;
  name: string;
  role: Admin["role"];
  department?: Admin["department"];
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  role?: Admin["role"];
  department?: Admin["department"];
  permissions?: Partial<AdminPermissions>;
  isActive?: boolean;
}

export interface CreatePaymentData {
  fullName: string;
  matricNumber: string;
  department: PaymentDepartment;
  level: string;
  amount: number;
  type: PaymentTypeEnum;
  email?: string;
  phoneNumber?: string;
  isExecutive?: boolean;
  scope?: string;
}

export interface CreateExecutiveData {
  fullName: string;
  matricNumber: string;
  scope: string;
}

export interface CreateAdminData {
  email: string;
  password: string;
  name: string;
  role: Admin["role"];
  department?: Admin["department"];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}





// Account types for the financial system
export interface AccountBalance {
  totalRevenue: number;
  expenses: number;
  availableBalance: number;
}

export interface PaginatedResponse<T> {
  totals: any;
  stats: SetStateAction<{ totalCount: number; totalAmount: number; collegeCount: number; collegeAmount: number; departmentalCount: number; departmentalAmount: number; maintenanceCount: number; maintenanceAmount: number; }>;
  data?: T[];
  expenses?: T[];
  payments?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters?: {
    type?: string;
    department?: string;
  };
}


// Department mapping constants for frontend
export const DEPARTMENT_MAPPING = {
  "Computer Science": "COMSSA",
  "Software Engineering": "SENIFSA",
  "Cyber Security": "CYDASA",
  "Information Technology": "ICITSA",
} as const;

export const REVERSE_DEPARTMENT_MAPPING = {
  COMSSA: "Computer Science",
  SENIFSA: "Software Engineering",
  CYDASA: "Cyber Security",
  ICITSA: "Information Technology",
} as const;

export const ACCOUNT_MAPPING = {
  college_general: "College General Fund",
  dept_comssa: "COMSSA Department Fund",
  dept_icitsa: "ICITSA Department Fund",
  dept_cydasa: "CYDASA Department Fund",
  dept_senifsa: "SENIFSA Department Fund",
} as const;

// Re-export types for backward compatibility with different names
export type {
  Payment as PaymentInterface,
  Executive as ExecutiveInterface,
  FinancialStats as FinancialStatsInterface,
  DashboardStats as DashboardStatsInterface,
};
