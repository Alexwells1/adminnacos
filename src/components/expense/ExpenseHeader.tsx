import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface ExpenseHeaderProps {
  adminRole?: string;
  lastUpdated?: string;
  cacheAvailable: boolean;
  canCreate: boolean;
  onRefresh: () => void;
  onCreateExpense: () => void;
}

export const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({
  adminRole,
  lastUpdated,
  cacheAvailable,
  canCreate,
  onRefresh,
  onCreateExpense,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Expense Management
        </h1>
        <p className="text-muted-foreground">
          {adminRole === "college_admin" && "College expenses only"}
          {adminRole === "dept_admin" && "Department expenses only"}
          {(adminRole === "super_admin" || adminRole === "director_finance") &&
            "All college and departmental expenses"}
          {lastUpdated && ` • Last updated: ${lastUpdated}`}
          {cacheAvailable && " (Cached)"}
          {!cacheAvailable && " (No Cache)"}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        {canCreate && (
          <Button onClick={onCreateExpense} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </div>
    </div>
  );
};
