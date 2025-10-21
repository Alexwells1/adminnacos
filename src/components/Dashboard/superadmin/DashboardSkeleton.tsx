import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-8 flex-1 sm:w-24" />
            <Skeleton className="h-8 flex-1 sm:w-24" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 rounded-md" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 flex-1 max-w-32" />
                    <Skeleton className="h-4 w-16 ml-2" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
