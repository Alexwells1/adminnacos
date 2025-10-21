// src/pages/PaymentsPage.tsx
import { CreateManualPayment } from "@/components/Payments/CreateManualPayment";
import { PaymentFilters } from "@/components/Payments/PaymentFilters";
import { PaymentSearch } from "@/components/Payments/PaymentSearch";
import { PaymentsHeader } from "@/components/Payments/PaymentsHeader";
import { PaymentSkeleton } from "@/components/Payments/paymentskel";
import { PaymentsPagination } from "@/components/Payments/PaymentsPagination";
import { PaymentTable } from "@/components/Payments/PaymentTable";

import { ProgressBar } from "@/components/Payments/ProgressBar";

import  { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePaymentsData } from "@/hooks/usePaymentsData";
import React from "react";

export const PaymentsPage: React.FC = () => {
  const {
    payments,
    loading,
    refreshing,
    searchLoading,
    cacheStatus,
    loadTime,
    progress,
    filters,
    setFilters,
    pagination,
    searchQuery,
    admin,
    hasPermission,
    handleSearch,
    handlePageChange,
    handleRefresh,
    handlePaymentCreated,
  } = usePaymentsData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <PaymentsHeader
        adminRole={admin?.role}
        adminDepartment={admin?.department}
        loadTime={loadTime}
        cacheStatus={cacheStatus}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Manual Payment Creation */}
      {hasPermission("canViewPayments") && (
        <CreateManualPayment onPaymentCreated={handlePaymentCreated} />
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Search & Filter Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentSearch onSearch={handleSearch} loading={searchLoading} />

          <PaymentFilters
            filters={filters}
            onFiltersChange={setFilters}
            onExportCSV={() => {}}
            onExportPDF={() => {}} 
            canExport={hasPermission("canExportData")}
          />
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <ProgressBar progress={progress} loading={loading} />

      {/* Prefetch Loading Indicator */}


      {/* Payment Table or Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>
              Payment Records
              {pagination.total > 0 && ` (${pagination.total} total)`}
              {cacheStatus === "fresh" && " 📦"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PaymentSkeleton />
          ) : (
            <PaymentTable
              payments={payments}
              loading={loading}
              onPaymentUpdate={() => {}} // This would be implemented
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <PaymentsPagination
        pagination={pagination}
        filters={filters}
        searchQuery={searchQuery}
        prefetchCache={{}}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
