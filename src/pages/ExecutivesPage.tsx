// src/pages/ExecutivesPage.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AddExecutiveForm } from "@/components/executives/AddExecutiveForm";
import { ExecutiveTable } from "@/components/executives/ExecutiveTable";
import { useAuth } from "@/contexts/useAuth";
import { useExecutivesData } from "@/hooks/useExecutivesData";
import { ExecutivesHeader } from "@/components/ExecutivesHeader";
import { ExecutivesInfo } from "@/components/ExecutivesInfo";
import { ExecutivesStats } from "@/components/ExecutivesStats";
import { ProgressBar } from "@/components/ProgressBar";

export const ExecutivesPage: React.FC = () => {
  const { admin } = useAuth();
  const {
    executives,
    loading,
    progress,
    loadTime,
    refreshing,
    cacheStatus,
    stats,
    canManageExecutives,
    handleManualRefresh,
  } = useExecutivesData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <ExecutivesHeader
        adminRole={admin?.role}
        loadTime={loadTime}
        cacheStatus={cacheStatus}
        refreshing={refreshing}
        onRefresh={handleManualRefresh}
      />

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Stats Cards */}
      <ExecutivesStats
        stats={stats}
        loading={loading}
        executivesCount={executives.length}
      />

      {/* Add Executive Form */}
      {canManageExecutives && (
        <AddExecutiveForm onExecutiveAdded={handleManualRefresh} />
      )}

      {/* Executive Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              Executive List ({executives.length})
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {canManageExecutives
                  ? "Manage executive students and their privileges"
                  : "View executive students with special payment privileges"}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ExecutiveTable
            executives={executives}
            loading={loading}
            onExecutiveUpdate={handleManualRefresh}
            canManage={canManageExecutives}
          />
        </CardContent>
      </Card>

      {/* Information Box */}
      <ExecutivesInfo />
    </div>
  );
};
