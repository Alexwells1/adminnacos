// src/components/Payments/PaymentFilters.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";

interface PaymentFiltersProps {
  filters: {
    type: string;
    department: string;
    level: string;
    startDate: string;
    endDate: string;
    sort: string;
  };
  onFiltersChange: (filters: any) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  canExport: boolean;
  isExporting?: boolean;
}

const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "Computer Science", label: "Computer Science (COMSSA)" },
  {
    value: "Software Engr & Information Systems",
    label: "Software Engineering (SENIFSA)",
  },
  { value: "Cybersecurity & Data Science", label: "Cyber Security (CYDASA)" },
  {
    value: "ICT & Information Technology",
    label: "Information Technology (ICITSA)",
  },
];

const PAYMENT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "college", label: "College" },
  { value: "departmental", label: "Departmental" },
];

// Updated LEVELS array - "200" now includes both regular and D.E
const LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "100", label: "Level 100" },
  { value: "200", label: "Level 200 (including 200 D.E)" },
  { value: "200 D.E", label: "Level 200 D.E" },
  { value: "300", label: "Level 300" },
  { value: "400", label: "Level 400" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount", label: "Highest Amount" },
];

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFiltersChange,
  onExportCSV,
  onExportPDF,
  canExport,
  isExporting = false,
}) => {
  const { admin, isRole } = useAuth();

  // Define which filters each admin role has access to
  const hasAccessTo = {
    paymentType: isRole(["super_admin", "director_finance"]),
    department: isRole(["super_admin", "director_finance", "college_admin"]),
    level: isRole([
      "super_admin",
      "director_finance",
      "college_admin",
      "dept_admin",
    ]),
    dateRange: isRole([
      "super_admin",
      "director_finance",
      "college_admin",
      "dept_admin",
    ]),
    sort: isRole([
      "super_admin",
      "director_finance",
      "college_admin",
      "dept_admin",
    ]),
  };

  // Get available payment types based on admin role
  const getAvailablePaymentTypes = () => {
    if (!hasAccessTo.paymentType) return [];

    if (isRole(["super_admin", "director_finance"])) {
      return PAYMENT_TYPES; 
    }

    if (isRole("college_admin")) {
      return PAYMENT_TYPES.filter(
        (type) => type.value === "college" || type.value === "all"
      );
    }

    if (isRole("dept_admin")) {
      return PAYMENT_TYPES.filter(
        (type) => type.value === "departmental" || type.value === "all"
      );
    }

    return PAYMENT_TYPES.filter((type) => type.value === "all");
  };

  // Get available departments based on admin role
  const getAvailableDepartments = () => {
    if (!hasAccessTo.department) return [];

    if (isRole(["super_admin", "director_finance", "college_admin"])) {
      return DEPARTMENTS; // Can see all departments
    }

    if (isRole("dept_admin") && admin?.department) {
      // Department admin can only see their own department
      const dept = DEPARTMENTS.find((d) => d.value === admin.department);
      return dept ? [DEPARTMENTS[0], dept] : [DEPARTMENTS[0]];
    }

    return [DEPARTMENTS[0]]; // Only "All Departments"
  };

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: "all",
      department: "all",
      level: "all",
      startDate: "",
      endDate: "",
      sort: "newest",
    });
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.department !== "all" ||
    filters.level !== "all" ||
    filters.startDate ||
    filters.endDate;

  const activeFilterCount = Object.values(filters).filter(
    (val) => val && val !== "all"
  ).length;

  const availablePaymentTypes = getAvailablePaymentTypes();
  const availableDepartments = getAvailableDepartments();

  // Count how many filter columns we need for responsive layout
  const visibleFilters = [
    hasAccessTo.paymentType && availablePaymentTypes.length > 0,
    hasAccessTo.department && availableDepartments.length > 0,
    hasAccessTo.level,
  ].filter(Boolean).length;

  const filterWidth = visibleFilters > 0 ? `flex-1 min-w-[200px]` : "flex-1";

  return (
    <div className="space-y-4">
      {/* First Row of Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Payment Type Filter - Completely hidden if no access */}
        {hasAccessTo.paymentType && availablePaymentTypes.length > 0 && (
          <div className={`space-y-2 ${filterWidth}`}>
            <Label htmlFor="type" className="text-sm font-medium">
              Payment Type
            </Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availablePaymentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availablePaymentTypes.length === 1 &&
              availablePaymentTypes[0].value === "college" && (
                <p className="text-xs text-gray-500">College payments only</p>
              )}
            {availablePaymentTypes.length === 1 &&
              availablePaymentTypes[0].value === "departmental" && (
                <p className="text-xs text-gray-500">
                  Departmental payments only
                </p>
              )}
          </div>
        )}

        {/* Department Filter - Completely hidden if no access */}
        {hasAccessTo.department && availableDepartments.length > 0 && (
          <div className={`space-y-2 ${filterWidth}`}>
            <Label htmlFor="department" className="text-sm font-medium">
              Department
            </Label>
            <Select
              value={filters.department}
              onValueChange={(value) => handleFilterChange("department", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableDepartments.length === 2 && isRole("dept_admin") && (
              <p className="text-xs text-gray-500">Your department only</p>
            )}
          </div>
        )}

        {/* Level Filter - Completely hidden if no access */}
        {hasAccessTo.level && (
          <div className={`space-y-2 ${filterWidth}`}>
            <Label htmlFor="level" className="text-sm font-medium">
              Level
            </Label>
            <Select
              value={filters.level}
              onValueChange={(value) => handleFilterChange("level", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.level === "200" && (
              <p className="text-xs text-green-600">
                Includes both Level 200 and Level 200 D.E
              </p>
            )}
          </div>
        )}

        {/* If no filters are visible in first row, show a message */}
        {visibleFilters === 0 && (
          <div className="flex-1 text-center py-4 text-gray-500 text-sm">
            No filters available for your role
          </div>
        )}
      </div>

      {/* Second Row of Filters - Completely hidden if no access */}
      {(hasAccessTo.dateRange || hasAccessTo.sort) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date Range Filters - Completely hidden if no access */}
          {hasAccessTo.dateRange && (
            <>
              <div className="space-y-2 flex-1 min-w-[150px]">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Start Date
                </Label>
                <Input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2 flex-1 min-w-[150px]">
                <Label
                  htmlFor="endDate"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  End Date
                </Label>
                <Input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Sort Filter - Completely hidden if no access */}
          {hasAccessTo.sort && (
            <div className="space-y-2 flex-1">
              <Label htmlFor="sort" className="text-sm font-medium">
                Sort By
              </Label>
              <Select
                value={filters.sort}
                onValueChange={(value) => handleFilterChange("sort", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          Active filters: {activeFilterCount}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex gap-2 justify-center sm:justify-start">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex-1 sm:flex-none"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex gap-2 justify-center sm:justify-end">
          {canExport && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportCSV}
                disabled={isExporting}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export CSV"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportPDF}
                disabled={isExporting}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
