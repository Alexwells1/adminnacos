import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/Dashboard/superadmin/DashboardHeader";
import { DashboardSkeleton } from "@/components/Dashboard/superadmin/DashboardSkeleton";
import { ErrorState } from "@/components/Dashboard/superadmin/ErrorState";
import { OverviewTab } from "@/components/Dashboard/superadmin/tabs/OverviewTab";
import { FinancialTab } from "@/components/Dashboard/superadmin/tabs/FinancialTab";
import { CollegeTab } from "@/components/Dashboard/superadmin/tabs/CollegeTab";
import { DepartmentalTab } from "@/components/Dashboard/superadmin/tabs/DepartmentalTab";
import { LevelsTab } from "@/components/Dashboard/superadmin/tabs/LevelsTab";
import { RecentTab } from "@/components/Dashboard/superadmin/tabs/RecentTab";
import { MaintenanceTab } from "@/components/Dashboard/superadmin/tabs/MaintenanceTab";
import { useDashboardData } from "@/hooks/useDashboardData";

// Lucide icons
import {
  Home,
  CreditCard,
  Users,
  Layers,
  BarChart,
  Clock,
  Hammer,
} from "lucide-react";

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
    isDashboardCacheValid,
  } = useDashboardData();

  if (loading) return <DashboardSkeleton />;
  if (!stats || !financialStats)
    return <ErrorState onRetry={() => loadDashboardData(true)} />;

  const tabs = [
    {
      value: "overview",
      icon: <Home className="w-4 h-4" />,
      label: "Overview",
    },
    {
      value: "financial",
      icon: <CreditCard className="w-4 h-4" />,
      label: "Financial",
    },
    {
      value: "maintenance",
      icon: <Hammer className="w-4 h-4" />,
      label: "Maintenance",
    },
    { value: "college", icon: <Users className="w-4 h-4" />, label: "College" },
    {
      value: "departmental",
      icon: <Layers className="w-4 h-4" />,
      label: "Departments",
    },
    {
      value: "levels",
      icon: <BarChart className="w-4 h-4" />,
      label: "Levels",
    },
    { value: "recent", icon: <Clock className="w-4 h-4" />, label: "Recent" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <DashboardHeader
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        isCacheValid={isDashboardCacheValid()}
        onRefresh={() => loadDashboardData(true)}
        onRecalculate={recalculateStats}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-auto gap-1 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex justify-center items-center text-xs py-2 px-1 sm:px-2"
              title={tab.label} // tooltip on hover
            >
              {tab.icon}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab stats={stats} financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <FinancialTab financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <MaintenanceTab financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="college" className="mt-4">
          <CollegeTab stats={stats} financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="departmental" className="mt-4">
          <DepartmentalTab stats={stats} financialStats={financialStats} />
        </TabsContent>

        <TabsContent value="levels" className="mt-4">
          <LevelsTab stats={stats} />
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <RecentTab recentPayments={recentPayments} stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
