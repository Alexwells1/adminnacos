import React from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Users, Target } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { StatsSkeleton } from "./StatsSkeleton";

interface ExecutivesStatsProps {
  stats: {
    total: number;
    byScope: Record<string, number>;
  };
  loading: boolean;
  executivesCount: number;
}

export const ExecutivesStats: React.FC<ExecutivesStatsProps> = ({
  stats,
  loading,
  executivesCount,
}) => {
  if (loading && executivesCount === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Stakeholders Card */}
      <StatsCard
        title="Total Stakeholders"
        value={stats.total}
        icon={Users}
        iconBgColor="bg-purple-500"
      />

      {/* Scope Breakdown Cards */}
      {Object.entries(stats.byScope).map(([scope, count]) => (
        <StatsCard
          key={scope}
          title={scope.replace("_", " ")}
          value={count}
          icon={Target}
          iconBgColor="bg-blue-500"
        />
      ))}

      {/* Fill remaining slots if less than 4 cards */}
      {Object.keys(stats.byScope).length < 3 &&
        Array.from({ length: 3 - Object.keys(stats.byScope).length }).map(
          (_, index) => (
            <Card
              key={`empty-${index}`}
              className="border-dashed border-2 border-muted"
            >
              <CardContent className="p-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">No data</p>
              </CardContent>
            </Card>
          )
        )}
    </div>
  );
};
