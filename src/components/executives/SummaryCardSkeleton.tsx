import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-4 w-24" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-7 w-12 mb-1" />
      <Skeleton className="h-3 w-16" />
    </CardContent>
  </Card>
);
