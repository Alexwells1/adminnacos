// src/types/expense.types.ts



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
  department?: "COMSSA" | "ICITSA" | "CYDASA" | "SENIFSA";
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
  department?: "COMSSA" | "ICITSA" | "CYDASA" | "SENIFSA";
  account:
    | "college_general"
    | "dept_comssa"
    | "dept_icitsa"
    | "dept_cydasa"
    | "dept_senifsa";
  date?: string;
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
