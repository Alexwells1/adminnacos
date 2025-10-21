import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


interface DashboardHeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  isCacheValid: boolean;
  onRefresh: () => void;
  onRecalculate: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
  isRefreshing,
  isCacheValid,
  onRefresh,
  onRecalculate,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Financial overview and analytics
          {isRefreshing && (
            <span className="ml-2 text-blue-500">• Refreshing...</span>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            Updated: {lastUpdated}
          </Badge>
          {!isCacheValid && (
            <Badge
              variant="outline"
              className="text-xs bg-yellow-50 border-yellow-200"
            >
              Data refreshing
            </Badge>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={onRecalculate}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            disabled={isRefreshing}
          >
            Recalculate
          </Button>
          <Button
            onClick={onRefresh}
            size="sm"
            className="flex-1 sm:flex-none"
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
    </div>
  );
};
