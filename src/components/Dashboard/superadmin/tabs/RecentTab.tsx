import React from "react";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats, Payment } from "@/types/admin.types";

interface RecentTabProps {
  recentPayments: Payment[];
  stats: DashboardStats;
}

export const RecentTab: React.FC<RecentTabProps> = ({
  recentPayments,
  stats,
}) => {
  return (
    <>
      <h2 className="text-lg font-semibold">Recent Activity</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentActivities payments={recentPayments} title="Recent Payments" />

        {stats?.dailyTrends && stats.dailyTrends.length > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Daily Trends (7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-4">
                {stats.dailyTrends.slice(0, 7).map((trend, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {new Date(trend._id).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ₦{trend.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trend.count} payments
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>No daily trends data available</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
