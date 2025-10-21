import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Clock, Shield } from "lucide-react";

interface ExecutivesHeaderProps {
  adminRole?: string;
  loadTime: number;
  cacheStatus: "fresh" | "stale" | "none";
  refreshing: boolean;
  onRefresh: () => void;
}

export const ExecutivesHeader: React.FC<ExecutivesHeaderProps> = ({
  adminRole,
  loadTime,
  cacheStatus,
  refreshing,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          Executive Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Manage students with special payment privileges • {adminRole}
        </p>
      </div>

      {/* Refresh and Status Controls */}
      <div className="flex items-center gap-3">
        {loadTime > 0 && (
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {loadTime.toFixed(0)}ms
          </Badge>
        )}

        {cacheStatus !== "none" && (
          <Badge
            variant={cacheStatus === "fresh" ? "default" : "secondary"}
            className="text-xs"
          >
            <Shield className="w-3 h-3 mr-1" />
            {cacheStatus === "fresh" ? "Cached" : "Stale"}
          </Badge>
        )}

        <Button
          onClick={onRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
};
