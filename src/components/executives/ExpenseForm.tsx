import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CreateExpenseData, FinancialStats } from "@/types/expense.types";

const ACCOUNT_CONFIG = {
  college_general: {
    name: "College General Fund",
    icon: "Building",
    description: "College dues and expenses",
    color: "blue",
  },
  dept_comssa: {
    name: "COMSSA Department",
    icon: "Users",
    description: "Computer Science department",
    color: "green",
  },
  dept_icitsa: {
    name: "ICITSA Department",
    icon: "Users",
    description: "Information Technology department",
    color: "purple",
  },
  dept_cydasa: {
    name: "CYDASA Department",
    icon: "Shield",
    description: "Cyber Security department",
    color: "red",
  },
  dept_senifsa: {
    name: "SENIFSA Department",
    icon: "Users",
    description: "Software Engineering department",
    color: "orange",
  },
  maintenance: {
    name: "Maintenance Fund",
    icon: "Wallet",
    description: "System maintenance expenses",
    color: "gray",
  },
} as const;

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData) => Promise<void>;
  loading: boolean;
  adminRole: string;
  adminDepartment?: string;
  financialStats: FinancialStats | null;
}

const getAvailableAccounts = (adminRole: string, adminDepartment?: string) => {
  if (adminRole === "college_admin") {
    return ["college_general"];
  } else if (adminRole === "dept_admin" && adminDepartment) {
    const departmentMap = {
      "Computer Science": "dept_comssa",
      "Software Engineering": "dept_senifsa",
      "Cybersecurity & Data Science": "dept_cydasa",
      "ICT & Information Technology": "dept_icitsa",
    } as const;
    return [departmentMap[adminDepartment as keyof typeof departmentMap]];
  } else if (adminRole === "super_admin" || adminRole === "director_finance") {
    return [
      "college_general",
      "dept_comssa",
      "dept_icitsa",
      "dept_cydasa",
      "dept_senifsa",
      "maintenance",
    ];
  }
  return [];
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  adminRole,
  adminDepartment,
  financialStats,
}) => {
  const [formData, setFormData] = useState<CreateExpenseData>({
    title: "",
    description: "",
    amount: 0,
    paymentMethod: "available_balance",
    type: "college",
    account: "college_general",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [accountBalance, setAccountBalance] = useState<number>(0);

  const availableAccounts = getAvailableAccounts(adminRole, adminDepartment);

  // Set default values based on admin role and update balance
  useEffect(() => {
    if (adminRole === "dept_admin" && adminDepartment) {
      const departmentMap = {
        "Computer Science": "COMSSA",
        "Software Engineering": "SENIFSA",
        "Cybersecurity & Data Science": "CYDASA",
        "ICT & Information Technology": "ICITSA",
      } as const;

      const dept = departmentMap[adminDepartment as keyof typeof departmentMap];
      const account =
        `dept_${dept.toLowerCase()}` as CreateExpenseData["account"];

      setFormData((prev) => ({
        ...prev,
        type: "departmental",
        department: dept,
        account,
      }));

      // Set initial balance for department admin
      if (financialStats) {
        const balance = financialStats.accounts[account]?.availableBalance || 0;
        setAccountBalance(balance);
      }
    } else if (adminRole === "college_admin") {
      setFormData((prev) => ({
        ...prev,
        type: "college",
        account: "college_general",
      }));

      // Set initial balance for college admin
      if (financialStats) {
        const balance =
          financialStats.accounts.college_general.availableBalance;
        setAccountBalance(balance);
      }
    } else if (
      adminRole === "super_admin" ||
      adminRole === "director_finance"
    ) {
      // Set initial balance for super admin
      if (financialStats) {
        const balance =
          financialStats.accounts.college_general.availableBalance;
        setAccountBalance(balance);
      }
    }
  }, [adminRole, adminDepartment, financialStats]);

  // Update balance when account changes
  useEffect(() => {
    if (financialStats) {
      if (formData.paymentMethod === "maintenance_balance") {
        setAccountBalance(financialStats.availableMaintenance);
      } else {
        const balance =
          financialStats.accounts[formData.account]?.availableBalance || 0;
        setAccountBalance(balance);
      }
    }
  }, [formData.account, formData.paymentMethod, financialStats]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.amount <= 0 || isNaN(formData.amount))
      newErrors.amount = "Amount must be greater than 0";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.account) newErrors.account = "Account is required";
    if (formData.type === "departmental" && !formData.department) {
      newErrors.department = "Department is required for departmental expenses";
    }

    // Check if amount exceeds available balance
    if (formData.amount > accountBalance) {
      newErrors.amount = `Amount exceeds available balance (₦${accountBalance.toLocaleString()})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        amount: 0,
        paymentMethod: "available_balance",
        type: "college",
        account: "college_general",
        date: new Date().toISOString().split("T")[0],
      });
      onClose();
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  const handleTypeChange = (value: string) => {
    const type = value as "college" | "departmental";
    setFormData((prev) => {
      if (type === "college") {
        return {
          ...prev,
          type: "college",
          department: undefined,
          account: "college_general",
        };
      } else {
        let defaultDept: CreateExpenseData["department"] = "COMSSA";
        let defaultAccount: CreateExpenseData["account"] = "dept_comssa";

        if (adminRole === "dept_admin" && adminDepartment) {
          const departmentMap = {
            "Computer Science": "COMSSA",
            "Software Engineering": "SENIFSA",
            "Cybersecurity & Data Science": "CYDASA",
            "ICT & Information Technology": "ICITSA",
          } as const;

          defaultDept =
            departmentMap[adminDepartment as keyof typeof departmentMap];
          defaultAccount =
            `dept_${defaultDept.toLowerCase()}` as CreateExpenseData["account"];
        }

        return {
          ...prev,
          type: "departmental",
          department: defaultDept,
          account: defaultAccount,
        };
      }
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value as "maintenance_balance" | "available_balance",
    });
  };

  const handleDepartmentChange = (value: string) => {
    const department = value as CreateExpenseData["department"];
    setFormData((prev) => ({
      ...prev,
      department,
      account:
        `dept_${department?.toLowerCase()}` as CreateExpenseData["account"],
    }));
  };

  const handleAccountChange = (value: string) => {
    setFormData({
      ...formData,
      account: value as CreateExpenseData["account"],
    });
  };

  const isCollegeAdmin = adminRole === "college_admin";
  const isDeptAdmin = adminRole === "dept_admin";
  const canChooseAccount =
    adminRole === "super_admin" || adminRole === "director_finance";
  const canChoosePaymentMethod =
    adminRole === "super_admin" || adminRole === "director_finance";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Balance Display */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Available Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{accountBalance.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {formData.paymentMethod === "maintenance_balance"
                      ? "Maintenance Fund"
                      : ACCOUNT_CONFIG[formData.account]?.name}
                  </p>
                  <Badge
                    variant={
                      formData.amount > accountBalance
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {formData.amount > accountBalance
                      ? "Insufficient"
                      : "Sufficient"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter expense title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter expense description"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
                disabled={isCollegeAdmin || isDeptAdmin}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="departmental">Departmental</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                disabled={!canChoosePaymentMethod}
              >
                <SelectTrigger
                  className={errors.paymentMethod ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available_balance">
                    Available Balance
                  </SelectItem>
                  {canChoosePaymentMethod && (
                    <SelectItem value="maintenance_balance">
                      Maintenance Balance
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-sm text-red-500">{errors.paymentMethod}</p>
              )}
              {!canChoosePaymentMethod && (
                <p className="text-xs text-gray-500">
                  Only available balance can be used for expenses
                </p>
              )}
            </div>
          </div>

          {formData.type === "departmental" && (
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department || ""}
                onValueChange={handleDepartmentChange}
                disabled={isDeptAdmin}
              >
                <SelectTrigger
                  className={errors.department ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMSSA">
                    Computer Science (COMSSA)
                  </SelectItem>
                  <SelectItem value="ICITSA">
                    Information Technology (ICITSA)
                  </SelectItem>
                  <SelectItem value="CYDASA">
                    Cyber Security (CYDASA)
                  </SelectItem>
                  <SelectItem value="SENIFSA">
                    Software Engineering (SENIFSA)
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="account">Account *</Label>
            <Select
              value={formData.account}
              onValueChange={handleAccountChange}
              disabled={!canChooseAccount}
            >
              <SelectTrigger className={errors.account ? "border-red-500" : ""}>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {availableAccounts.map((account) => (
                  <SelectItem key={account} value={account}>
                    {
                      ACCOUNT_CONFIG[account as keyof typeof ACCOUNT_CONFIG]
                        ?.name
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.account && (
              <p className="text-sm text-red-500">{errors.account}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || formData.amount > accountBalance}
            >
              {loading ? "Creating..." : "Create Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
