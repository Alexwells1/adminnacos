import React from "react";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types/admin.types";

interface LevelsTabProps {
  stats: DashboardStats;
}

export const LevelsTab: React.FC<LevelsTabProps> = ({ stats }) => {
  const getDepartmentLevelBreakdown = () => {
    if (!stats?.levelWiseDept) return [];
    return stats.levelWiseDept.map((item) => ({
      _id: String(item._id),
      revenue: item.revenue,
      count: item.count,
    }));
  };

  const departmentLevelBreakdown = getDepartmentLevelBreakdown();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Level-wise Analysis</h2>

      {departmentLevelBreakdown.length > 0 ? (
        <>
          <BreakdownTable
            title="Department Payments by Level"
            data={departmentLevelBreakdown}
            type="level"
          />

          {/* Level Details */}
          <Card>
            <CardHeader>
              <CardTitle>Level Breakdown Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Level</th>
                      <th className="text-right p-4 font-medium">Payments</th>
                      <th className="text-right p-4 font-medium">Revenue</th>
                      <th className="text-right p-4 font-medium">Average</th>
                      <th className="text-right p-4 font-medium">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentLevelBreakdown.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4 font-medium">{item._id}</td>
                        <td className="p-4 text-right">{item.count}</td>
                        <td className="p-4 text-right">
                         
                        </td>
                        <td className="p-4 text-right">
                         
                        </td>
                        <td className="p-4 text-right">
                          {stats.totalDeptRevenue !== undefined
                            ? (
                                (item.revenue / stats.totalDeptRevenue) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Level-wise Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No level data available for this department
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
