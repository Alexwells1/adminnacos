import React, { useEffect } from "react";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import type { DashboardStats } from "@/types/admin.types";

interface LevelsTabProps {
  stats: DashboardStats;
}

export const LevelsTab: React.FC<LevelsTabProps> = ({ stats }) => {
  useEffect(() => {
    console.log("LevelsTab stats:", stats.levelBreakdown);
  });
  return (
    <>
      <h2 className="text-lg font-semibold">Level Analysis</h2>

      {stats.levelBreakdown && (
        <BreakdownTable
          title="Revenue by Level"
          data={stats.levelBreakdown}
          type="level"
        />
      )}

      {!stats.levelBreakdown && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No level breakdown data available</p>
        </div>
      )}
    </>
  );
};
