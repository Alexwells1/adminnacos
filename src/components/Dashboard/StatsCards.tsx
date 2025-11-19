// components/dashboard/StatsCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: React.ReactNode; 
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal";
  icon?: React.ReactNode;
}


export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    purple: "border-l-purple-500",
    orange: "border-l-orange-500",
    red: "border-l-red-500",
    teal: "border-l-teal-500",
  };

  return (
    <Card
      className={`w-full border-l-4 ${colorClasses[color]} hover:shadow-sm transition-shadow`}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
