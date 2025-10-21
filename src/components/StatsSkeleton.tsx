import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatsSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </CardContent>
  </Card>
);
