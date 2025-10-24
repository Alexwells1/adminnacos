// src/types/expense.types.ts

// Department types - use codes (matching backend model)
export type ExpenseDepartment = "COMSSA" | "ICITSA" | "CYDASA" | "SENIFSA";

// Department names (for admin department field)
export type AdminDepartment =
  | "Computer Science"
  | "ICT & Information Technology"
  | "Cybersecurity & Data Science"
  | "Software Engr & Information Systems";

export interface FinancialStats {
  // Maintenance account
  totalMaintenance: number;
  maintenanceExpenses: number;
  availableMaintenance: number;

  // Independent accounts
  accounts: {
    college_general: AccountBalance;
    dept_comssa: AccountBalance;
    dept_icitsa: AccountBalance;
    dept_cydasa: AccountBalance;
    dept_senifsa: AccountBalance;
  };

  // Summary fields
  totalCollegeRevenue: number;
  totalDepartmentalRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  lastUpdated: string;
}

export interface AccountBalance {
  totalRevenue: number;
  expenses: number;
  availableBalance: number;
  lastUpdated: string;
}

export interface Expense {
  _id: string;
  title: string;
  description: string;
  amount: number;
  paymentMethod: "maintenance_balance" | "available_balance";
  type: "college" | "departmental";
  department?: ExpenseDepartment; // Use ExpenseDepartment here
  account:
    | "college_general"
    | "dept_comssa"
    | "dept_icitsa"
    | "dept_cydasa"
    | "dept_senifsa";
  date: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  title: string;
  description: string;
  amount: number;
  paymentMethod: "maintenance_balance" | "available_balance";
  type: "college" | "departmental";
  department?: ExpenseDepartment; // Use ExpenseDepartment here
  account:
    | "college_general"
    | "dept_comssa"
    | "dept_icitsa"
    | "dept_cydasa"
    | "dept_senifsa";
  date?: string;
}

export interface ExpensesResponse {
  expenses: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedExpenses {
  expenses: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  type?: "college" | "departmental";
  department?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}

// Account mapping for display
export const ACCOUNT_DISPLAY_NAMES = {
  college_general: "College General Fund",
  dept_comssa: "COMSSA Department",
  dept_icitsa: "ICITSA Department",
  dept_cydasa: "CYDASA Department",
  dept_senifsa: "SENIFSA Department",
} as const;

export const DEPARTMENT_DISPLAY_NAMES = {
  COMSSA: "Computer Science (COMSSA)",
  ICITSA: "Information Technology (ICITSA)",
  CYDASA: "Cyber Security (CYDASA)",
  SENIFSA: "Software Engineering (SENIFSA)",
} as const;

// Department mapping constants (matching backend)
export const DEPARTMENT_MAPPING = {
  "Computer Science": "COMSSA",
  "ICT & Information Technology": "ICITSA",
  "Cybersecurity & Data Science": "CYDASA",
  "Software Engr & Information Systems": "SENIFSA",
} as const;

export const REVERSE_DEPARTMENT_MAPPING = {
  COMSSA: "Computer Science",
  ICITSA: "ICT & Information Technology",
  CYDASA: "Cybersecurity & Data Science",
  SENIFSA: "Software Engr & Information Systems",
} as const;
