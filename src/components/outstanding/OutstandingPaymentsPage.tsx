import adminService from "@/services/admin.service";
import type {
  OutstandingPayment,
  OutstandingFilters,
} from "@/types/admin.types";
import React, { useEffect, useState } from "react";
import OutstandingPaymentDetailsModal from "./OutstandingPaymentDetailsModal";

const OutstandingPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<OutstandingPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<OutstandingFilters>({});
  const [summary, setSummary] = useState<{
    total: number;
    totalAmount: number;
  }>({ total: 0, totalAmount: 0 });
  const [selectedPayment, setSelectedPayment] =
    useState<OutstandingPayment | null>(null);

  // Fetch paginated data
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminService.outstanding.getOutstandingPayments({
        ...filters,
        page,
        limit,
      });
      setPayments(res.data || []);
      setTotal(res.totalCount);
      setSummary((prev) => ({ ...prev, total: res.totalCount }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary cards
  const fetchSummary = async () => {
    try {
      const res = await adminService.outstanding.getSummary();
      setSummary((prev) => ({ ...prev, totalAmount: res.totalAmount }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, [page, filters]);

  // CSV download
  const handleExportCSV = async () => {
    try {
      const blob = await adminService.outstanding.exportCSV(filters);
      adminService.utils.downloadBlob(blob, "outstanding-payments.csv");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle filter change
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Outstanding Payments</h1>

      {/* Summary cards */}
      <div className="flex gap-4 mb-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Payments</p>
          <p className="text-xl font-bold">{summary.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xl font-bold">
            ₦{(summary.totalAmount ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters & Export */}
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name, matric, email..."
          name="search"
          className="border p-2 rounded flex-1"
          value={filters.search || ""}
          onChange={handleFilterChange}
        />
        <select
          name="department"
          value={filters.department || ""}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="ICT & Information Technology">
            ICT & Information Technology
          </option>
          <option value="Cybersecurity & Data Science">
            Cybersecurity & Data Science
          </option>
          <option value="Software Engr & Information Systems">
            Software Engr & Information Systems
          </option>
        </select>

        <button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Matric Number</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-2 border">{p.fullName}</td>
                  <td className="px-4 py-2 border">{p.matricNumber}</td>
                  <td className="px-4 py-2 border">{p.email}</td>
                  <td className="px-4 py-2 border">{p.department}</td>
                  <td className="px-4 py-2 border">
                    ₦{(p.amount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedPayment && (
        <OutstandingPaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default OutstandingPaymentsPage;
