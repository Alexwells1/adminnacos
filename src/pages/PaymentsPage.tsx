// src/pages/PaymentsPage.tsx
import React, { useState, useEffect } from "react";
import { PaymentTable } from "../components/Payments/PaymentTable";
import { PaymentFilters } from "../components/Payments/PaymentFilters";
import { PaymentSearch } from "../components/Payments/PaymentSearch";
import { paymentService } from "../services/admin.service";
import { useAuth } from "../contexts/useAuth";
import { CreateManualPayment } from "../components/Payments/CreateManualPayment";
import type { PaginatedResponse, Payment } from "../types/admin.types";

export const PaymentsPage: React.FC = () => {
  const { hasPermission } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    type: "",
    department: "",
    level: "",
    startDate: "",
    endDate: "",
    sort: "newest",
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadPayments();
    }
  }, [filters, pagination.page, pagination.limit]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        ...(filters.type && { type: filters.type }),
        ...(filters.department && { department: filters.department }),
        ...(filters.level && { level: filters.level }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const response: PaginatedResponse<Payment> =
        await paymentService.getPayments(params);
      setPayments(response.payments);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchQuery("");
      loadPayments();
      return;
    }

    try {
      const response = await paymentService.searchPayments(query);
      setPayments(response.results);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
        totalPages: Math.ceil(response.count / pagination.limit),
      }));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await paymentService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("CSV export failed:", error);
      alert("Failed to export CSV");
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await paymentService.exportPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_summary_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600">View and manage all payment records</p>
      </div>

      <CreateManualPayment onPaymentCreated={loadPayments} />

      {/* Search */}
      <PaymentSearch onSearch={handleSearch} loading={searchLoading} />

      {/* Filters */}
      <PaymentFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        canExport={hasPermission("canExportData")}
      />

      {/* Payment Table */}
      <PaymentTable
        payments={payments}
        loading={loading}
        onPaymentUpdate={loadPayments}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    page === pagination.page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
