// src/components/Payments/PaymentsHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw, Package, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentsHeaderProps {
  adminRole?: string;
  adminDepartment?: string;
  loadTime?: number;
  cacheStatus?: "fresh" | "stale" | "none";
  refreshing?: boolean;
  prefetchLoading?: any; // Changed from Set to any to avoid issues
  onRefresh: () => void;
}

export const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({
  adminRole,
  adminDepartment,
  loadTime = 0,
  cacheStatus = "none",
  refreshing = false,
  onRefresh,
}) => {
  // Safe defaults for all values
  const safeAdminRole = adminRole || "Unknown Role";
  const safeAdminDepartment = adminDepartment || "No Department";
  const safeLoadTime = loadTime || 0;
  const safeCacheStatus = cacheStatus || "none";
  const safeRefreshing = refreshing || false;

  const getCacheStatusColor = (status: string) => {
    switch (status) {
      case "fresh":
        return "bg-green-100 text-green-800";
      case "stale":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCacheStatusText = (status: string) => {
    switch (status) {
      case "fresh":
        return "Cached";
      case "stale":
        return "Stale";
      default:
        return "No Cache";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Payment Management
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Role: {safeAdminRole}</span>
              </div>
              {safeAdminDepartment &&
                safeAdminDepartment !== "No Department" && (
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>Dept: {safeAdminDepartment}</span>
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={getCacheStatusColor(safeCacheStatus)}
              >
                {getCacheStatusText(safeCacheStatus)}
              </Badge>

              {safeLoadTime > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{safeLoadTime.toFixed(0)}ms</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={safeRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${safeRefreshing ? "animate-spin" : ""}`}
              />
              {safeRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          {safeCacheStatus === "fresh" && "✅ Data is cached for fast loading"}
          {safeCacheStatus === "stale" &&
            "🔄 Cache is stale, refresh for latest data"}
          {safeCacheStatus === "none" && "📡 Loading fresh data from server"}
        </div>
      </CardContent>
    </Card>
  );
};
