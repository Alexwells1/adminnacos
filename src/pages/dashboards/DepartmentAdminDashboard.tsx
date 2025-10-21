// components/dashboard/department-admin/DepartmentAdminDashboard.tsx

import { DashboardError } from "@/components/Dashboard/DashboardError";
import { DashboardLoading } from "@/components/Dashboard/DashboardLoading";
import { DepartmentHeader } from "@/components/Dashboard/Dept/DepartmentHeader";
import { DepartmentTabs } from "@/components/Dashboard/Dept/DepartmentTabs";
import { DepartmentStudentsTab } from "@/components/Dashboard/Dept/tab/DepartmentStudentsTab";
import { LevelsTab } from "@/components/Dashboard/Dept/tab/LevelsTab";
import { OverviewTab } from "@/components/Dashboard/Dept/tab/OverviewTab";
import { RecentTab } from "@/components/Dashboard/Dept/tab/RecentTab";

import { useDepartmentData } from "@/hooks/useDepartmentData";
import React, { useState } from "react";


const DepartmentAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    stats,
    recentPayments,
    loading,
    isRefreshing,
    lastUpdated,
    cacheAvailable,
    departmentName,
    getDepartmentDisplayName,
    getDepartmentAccountKey,
    isCacheValid,
    loadDashboardData,
    handleManualRefresh,
  } = useDepartmentData();

  if (loading && !stats) {
    return <DashboardLoading cardCount={4} hasTabs={true} />;
  }

  if (!stats || !departmentName) {
    return (
      <DashboardError
        onRetry={() => loadDashboardData(true)}
        title="Error Loading Department Data"
        message="Failed to load department dashboard data. Please try again."
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6">
      <DepartmentHeader
        departmentName={getDepartmentDisplayName()}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        cacheAvailable={cacheAvailable}
        isCacheValid={isCacheValid()}
        onRefresh={handleManualRefresh}
      />

      <DepartmentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overviewContent={
          <OverviewTab
            stats={stats}
            getDepartmentAccountKey={getDepartmentAccountKey}
            getDepartmentDisplayName={getDepartmentDisplayName}
          />
        }
        levelsContent={<LevelsTab stats={stats} />}
        studentsContent={
          <DepartmentStudentsTab students={stats.departmentStudents || []} />
        }
        recentContent={
          <RecentTab
            recentPayments={recentPayments}
            stats={stats}
            getDepartmentAccountKey={getDepartmentAccountKey}
            getDepartmentDisplayName={getDepartmentDisplayName}
          />
        }
      />
    </div>
  );
};

export default DepartmentAdminDashboard;
