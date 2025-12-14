// components/expenses/ExpenseManagement.tsx
import { ExpenseForm } from "@/components/executives/ExpenseForm";
import { ExpenseTable } from "@/components/executives/ExpenseTable";
import { ExpenseTabs } from "@/components/executives/ExpenseTabs";
import { EditExpenseModal } from "@/components/expense/EditExpenseModal";
import { ExpenseHeader } from "@/components/expense/ExpenseHeader";
import { useExpensesData } from "@/hooks/useExpensesData";
import { useFinancialStats } from "@/hooks/useFinancialStats";
import type { Expense } from "@/types/expense.types";
import React, { useState } from "react";


export const ExpenseManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    expenses,
    loading,
    creating,
    deleting,
    filters,
    searchTerm,
    setSearchTerm,
    pagination,
    cacheAvailable,
    canCreate,
    canManage,
    canViewAll,
    admin,
    handleCreateExpense,
    handleDeleteExpense,
    handlePageChange,
    handleFilterChange,
    handleRefresh,
    handleUpdateExpense,
    editing,
  } = useExpensesData();


  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  const {
    financialStats,
    loading: statsLoading,
    lastUpdated,
    cacheAvailable: statsCacheAvailable,
  } = useFinancialStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <ExpenseHeader
        adminRole={admin?.role}
        lastUpdated={lastUpdated}
        cacheAvailable={cacheAvailable && statsCacheAvailable}
        canCreate={canCreate}
        onRefresh={handleRefresh}
        onCreateExpense={() => setShowForm(true)}
      />

      {/* Account Balances Tabs */}
      <ExpenseTabs
        adminRole={admin?.role}
        adminDepartment={admin?.department}
        financialStats={financialStats}
        loading={statsLoading}
        cacheAvailable={statsCacheAvailable}
      />

      {/* Expenses Table */}
      <ExpenseTable
        expenses={expenses}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        pagination={pagination}
        canManage={canManage}
        canViewAll={canViewAll}
        admin={admin}
        deleting={deleting}
        onDeleteExpense={handleDeleteExpense}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onEditExpense={handleEditClick}
      />

      {/* Create Expense Form Modal */}
      <ExpenseForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateExpense}
        loading={creating}
        adminRole={admin?.role || ""}
        adminDepartment={admin?.department}
        financialStats={financialStats}
      />

      <EditExpenseModal
        open={editOpen}
        expense={selectedExpense}
        loading={editing === selectedExpense?._id}
        onClose={() => setEditOpen(false)}
        onSubmit={(updates) => {
          handleUpdateExpense(selectedExpense!._id, updates);
          setEditOpen(false);
        }}
      />
    </div>
  );
};

export default ExpenseManagement;
