import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-blue-500",
  iconColor = "text-white",
  className = "",
}) => {
  return (
    <Card
      className={`hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
