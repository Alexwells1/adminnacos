// components/dashboard/super-admin/SuperAdminDashboard.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/Dashboard/superadmin/DashboardHeader";
import { DashboardSkeleton } from "@/components/Dashboard/superadmin/DashboardSkeleton";
import { ErrorState } from "@/components/Dashboard/superadmin/ErrorState";
import { OverviewTab } from "@/components/Dashboard/superadmin/tabs/OverviewTab";
import { useDashboardData } from "@/hooks/useDashboardData";
import { FinancialTab } from "@/components/Dashboard/superadmin/tabs/FinancialTab";
import { CollegeTab } from "@/components/Dashboard/superadmin/tabs/CollegeTab";
import { DepartmentalTab } from "@/components/Dashboard/superadmin/tabs/DepartmentalTab";
import { LevelsTab } from "@/components/Dashboard/superadmin/tabs/LevelsTab";
import { RecentTab } from "@/components/Dashboard/superadmin/tabs/RecentTab";


const SuperAdminDashboard: React.FC = () => {
  const {
    stats,
    financialStats,
    recentPayments,
    loading,
    lastUpdated,
    isRefreshing,
    loadDashboardData,
    recalculateStats,
    isCacheValid,
  } = useDashboardData();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats || !financialStats) {
    return <ErrorState onRetry={() => loadDashboardData(true)} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <DashboardHeader
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        isCacheValid={isCacheValid()}
        onRefresh={() => loadDashboardData(true)}
        onRecalculate={recalculateStats}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto gap-1 p-1">
          {[
            { value: "overview", label: "Overview" },
            { value: "financial", label: "Financial" },
            { value: "college", label: "College" },
            { value: "departmental", label: "Departments" },
            { value: "levels", label: "Levels" },
            { value: "recent", label: "Recent" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs py-2 px-1 sm:px-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <OverviewTab stats={stats} financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 mt-4">
          <FinancialTab financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="college" className="space-y-4 mt-4">
          <CollegeTab stats={stats} financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="departmental" className="space-y-4 mt-4">
          <DepartmentalTab stats={stats} financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="levels" className="space-y-4 mt-4">
          <LevelsTab stats={stats} />
        </TabsContent>

        <TabsContent value="recent" className="space-y-4 mt-4">
          <RecentTab recentPayments={recentPayments} stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
