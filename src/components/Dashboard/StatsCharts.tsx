// src/components/Dashboard/StatsCharts.tsx
import React from "react";
import type { DashboardStats } from "../../types/admin.types";

interface StatsChartsProps {
  stats: DashboardStats;
}

export const StatsCharts: React.FC<StatsChartsProps> = ({ stats }) => {
  // College vs Departmental Revenue Chart
  const renderCollegeVsDeptChart = () => {
    if (!stats.collegeVsDeptRevenue?.length) return null;

    const collegeData = stats.collegeVsDeptRevenue.find(
      (d) => d._id === "college"
    );
    const deptData = stats.collegeVsDeptRevenue.find(
      (d) => d._id === "departmental"
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Revenue by Type
        </h3>
        <div className="space-y-4">
          {collegeData && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">College Payments</span>
                <span className="font-medium">
                  ₦{collegeData.revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (collegeData.revenue /
                        (collegeData.revenue + (deptData?.revenue || 0))) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {collegeData.count} payments
              </div>
            </div>
          )}

          {deptData && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Departmental Payments</span>
                <span className="font-medium">
                  ₦{deptData.revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (deptData.revenue /
                        ((collegeData?.revenue || 0) + deptData.revenue)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {deptData.count} payments
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Level Breakdown Chart
  const renderLevelBreakdown = () => {
    if (!stats.levelBreakdown?.length) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payments by Level
        </h3>
        <div className="space-y-3">
          {stats.levelBreakdown.map((level) => (
            <div key={level._id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Level {level._id}</span>
                <span className="font-medium">
                  ₦{level.revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (level.count /
                        stats.levelBreakdown!.reduce(
                          (sum, l) => sum + l.count,
                          0
                        )) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {level.count} payments
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Department Breakdown
  const renderDepartmentBreakdown = () => {
    if (!stats.departmentBreakdown?.length) return null;

    const topDepartments = stats.departmentBreakdown.slice(0, 5);

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Departments
        </h3>
        <div className="space-y-3">
          {topDepartments.map((dept) => (
            <div key={dept._id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{dept._id || "Unknown"}</span>
                <span className="font-medium">
                  ₦{dept.revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (dept.revenue /
                        topDepartments.reduce((sum, d) => sum + d.revenue, 0)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {dept.count} payments
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Executive vs Regular
  const renderExecutiveVsRegular = () => {
    if (!stats.executiveVsRegular?.length) return null;

    const executiveData = stats.executiveVsRegular.find((d) => d._id === true);
    const regularData = stats.executiveVsRegular.find((d) => d._id === false);

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Executive vs Regular
        </h3>
        <div className="space-y-4">
          {executiveData && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Executive Payments</span>
                <span className="font-medium">
                  ₦{executiveData.revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (executiveData.count /
                        ((executiveData.count || 0) +
                          (regularData?.count || 0))) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {executiveData.count} payments
              </div>
            </div>
          )}

          {regularData && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Regular Payments</span>
                <span className="font-medium">
                  ₦{regularData.revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (regularData.count /
                        ((executiveData?.count || 0) + regularData.count)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {regularData.count} payments
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {renderCollegeVsDeptChart()}
      {renderLevelBreakdown()}
      {renderDepartmentBreakdown()}
      {renderExecutiveVsRegular()}
    </div>
  );
};
