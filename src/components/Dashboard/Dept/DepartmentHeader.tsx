import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

interface DepartmentHeaderProps {
  departmentName: string;
  lastUpdated: string;
  isRefreshing: boolean;
  cacheAvailable: boolean;
  isCacheValid: boolean;
  onRefresh: () => void;
}

export const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  departmentName,
  lastUpdated,
  isRefreshing,
  cacheAvailable,
  isCacheValid,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          {departmentName} Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of {departmentName} payments and activities
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              Updated: {lastUpdated}
            </Badge>
            {cacheAvailable && isCacheValid && (
              <Badge variant="outline" className="text-xs bg-green-50">
                Cached
              </Badge>
            )}
            {!cacheAvailable && (
              <Badge variant="outline" className="text-xs bg-yellow-50">
                No Cache
              </Badge>
            )}
            {isRefreshing && (
              <Badge
                variant="default"
                className="text-xs bg-blue-50 text-blue-700"
              >
                Refreshing...
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        size="sm"
        className="w-full lg:w-auto gap-2"
      >
        <RefreshCw
          className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        {isRefreshing ? "Refreshing..." : "Refresh Data"}
      </Button>
    </div>
  );
};
