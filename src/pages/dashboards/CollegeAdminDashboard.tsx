// components/dashboard/college-admin/CollegeAdminDashboard.tsx
import { CollegeHeader } from "@/components/Dashboard/college/CollegeHeader";
import { CollegeTabs } from "@/components/Dashboard/college/CollegeTabs";
import { OverviewTab } from "@/components/Dashboard/college/OverviewTab";
import { StudentsTab } from "@/components/Dashboard/college/StudentsTab";
import { DashboardError } from "@/components/Dashboard/DashboardError";
import { DashboardLoading } from "@/components/Dashboard/DashboardLoading";
import { RecentTab } from "@/components/Dashboard/superadmin/tabs/RecentTab";
import { useCollegeData } from "@/hooks/useCollegeData";
import React, { useState } from "react";


const CollegeAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    stats,
    recentPayments,
    loading,
    lastUpdated,
    isRefreshing,
    cacheAvailable,
    isCacheValid,
    loadDashboardData,
    handleManualRefresh,
  } = useCollegeData();

  if (loading && !stats) {
    return <DashboardLoading cardCount={4} hasTabs={true} />;
  }

  if (!stats) {
    return (
      <DashboardError
        onRetry={() => loadDashboardData(true)}
        title="Error Loading College Data"
        message="Failed to load college dashboard data. Please try again."
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6">
      <CollegeHeader
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        cacheAvailable={cacheAvailable}
        isCacheValid={isCacheValid()}
        onRefresh={handleManualRefresh}
      />

      <CollegeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overviewContent={<OverviewTab stats={stats} />}
        studentsContent={<StudentsTab payments={stats.recentPayments || []} />}
        recentContent={
          <RecentTab recentPayments={recentPayments} stats={stats} />
        }
      />
    </div>
  );
};

export default CollegeAdminDashboard;
