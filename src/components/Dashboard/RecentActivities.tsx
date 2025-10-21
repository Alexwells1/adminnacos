// components/dashboard/RecentActivities.tsx
import type { Payment } from "@/types/admin.types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentActivitiesProps {
  payments?: Payment[];
  title?: string;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  payments = [],
  title = "Recent Activities",
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getPaymentTypeVariant = (type: string) => {
    return type === "college" ? "default" : "secondary";
  };

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No recent payments found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex items-center justify-between p-3 hover:bg-muted/50 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Badge
                  variant={getPaymentTypeVariant(payment.type)}
                  className="text-xs shrink-0"
                >
                  {payment.type}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {payment.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {payment.matricNumber}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-medium">
                  ₦{payment.amount?.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(payment.paidAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
