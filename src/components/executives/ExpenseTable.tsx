import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { Expense, ExpenseFilters } from "@/types/expense.types";
import { ExpenseRow } from "./ExpenseRow";

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: ExpenseFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  canManage: boolean;
  canViewAll: boolean;
  admin?: any;
  deleting: string | null;
  onDeleteExpense: (id: string) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (key: keyof ExpenseFilters, value: any) => void;
  onEditExpense: (expense: Expense) => void;
}

const getAvailableDepartments = (
  adminRole: string,
  adminDepartment?: string
) => {
const allDepartments = [
  { value: "all", label: "All Departments" },
  { value: "college", label: "College Expenses" }, // new option
  { value: "COMSSA", label: "Computer Science (COMSSA)" },
  { value: "ICITSA", label: "Information Technology (ICITSA)" },
  { value: "CYDASA", label: "Cyber Security (CYDASA)" },
  { value: "SENIFSA", label: "Software Engineering (SENIFSA)" },
];


  if (adminRole === "super_admin" || adminRole === "director_finance") {
    return allDepartments;
  } else if (adminRole === "college_admin") {
    return [allDepartments[0]]; // Only "All Departments"
  } else if (adminRole === "dept_admin" && adminDepartment) {
    const departmentMap = {
      "Computer Science": "COMSSA",
      "Software Engineering": "SENIFSA",
      "Cybersecurity & Data Science": "CYDASA",
      "ICT & Information Technology": "ICITSA",
    } as const;

    const userDept =
      departmentMap[adminDepartment as keyof typeof departmentMap];
    const deptOption = allDepartments.find((d) => d.value === userDept);
    return deptOption ? [allDepartments[0], deptOption] : [allDepartments[0]];
  }

  return [allDepartments[0]];
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  loading,
  searchTerm,
  setSearchTerm,
  filters,
  pagination,
  canManage,
  admin,
  deleting,
  onDeleteExpense,
  onPageChange,
  onFilterChange,
  onEditExpense,
}) => {
  const availableDepartments = getAvailableDepartments(
    admin?.role || "",
    admin?.department
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Expenses</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {availableDepartments.length > 1 && (
              <Select
                value={filters.department || "all"}
                onValueChange={(value) =>
                  onFilterChange(
                    "department",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-lg font-medium mb-2">No expenses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : admin?.role === "college_admin"
                ? "No college expenses found"
                : admin?.role === "dept_admin"
                ? `No ${admin.department} department expenses found`
                : "Get started by creating your first expense"}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense Details</TableHead>
                  <TableHead>Amount</TableHead>
                  {admin?.role === "super_admin" && <TableHead>Type</TableHead>}
                  {admin?.role === "super_admin" && (
                    <TableHead>Department</TableHead>
                  )}
                  <TableHead>Date</TableHead>
                  {admin?.role === "super_admin" && (
                    <TableHead>Created By</TableHead>
                  )}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expenses.map((expense) => (
                  <ExpenseRow
                    key={expense._id}
                    expense={expense}
                    onDelete={onDeleteExpense}
                    onEdit={onEditExpense}
                    canManage={canManage}
                    deleting={deleting}
                    adminRole={admin?.role}
                  />
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() => onPageChange(page)}
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
