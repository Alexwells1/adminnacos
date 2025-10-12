// src/components/Payments/PaymentFilters.tsx
import React from "react";

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
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFiltersChange,
  onExportCSV,
  onExportPDF,
  canExport,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Payment Type Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="college">College</option>
            <option value="departmental">Departmental</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">
              Electrical Engineering
            </option>
            <option value="Mechanical Engineering">
              Mechanical Engineering
            </option>
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange("level", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Levels</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount">Amount (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
        <div className="text-xs sm:text-sm text-gray-500">
          Use filters to find specific payments
        </div>

        {canExport && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExportCSV}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={onExportPDF}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
