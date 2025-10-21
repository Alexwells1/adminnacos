import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AccountBalanceSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-24" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </CardContent>
  </Card>
);
