// src/components/Payments/PaymentTable.tsx
import React, { useState } from "react";
import type { Payment } from "../../types/admin.types";
import { paymentService, receiptService } from "../../services/admin.service";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Eye,
  Download,
  Mail,
  Edit,
  Trash2,
  User,
  School,
  Calendar,
  FileText,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  onPaymentUpdate: () => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  loading,
  onPaymentUpdate,
}) => {
  const { admin } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    matricNumber: "",
    department: "",
    level: "",
    amount: "",
    email: "",
    phoneNumber: "",
  });

  const canEditPayment = (payment: Payment): boolean => {
    if (admin?.role === "super_admin") return true;
    if (admin?.role === "dept_admin") {
      return payment.department === admin.department;
    }
    if (admin?.role === "college_admin") {
      return payment.type === "college";
    }
    return false;
  };

  const canDeletePayment = (payment: Payment): boolean => {
    return admin?.role === "super_admin";
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditForm({
      fullName: payment.fullName,
      matricNumber: payment.matricNumber,
      department: payment.department,
      level: payment.level,
      amount: payment.amount.toString(),
      email: payment.email || "",
      phoneNumber: payment.phoneNumber || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPayment) return;

    setActionLoading(selectedPayment._id);
    try {
      const updates = {
        fullName: editForm.fullName,
        matricNumber: editForm.matricNumber,
        department: editForm.department,
        level: editForm.level,
        amount: parseFloat(editForm.amount),
        email: editForm.email || undefined,
        phoneNumber: editForm.phoneNumber || undefined,
      };

      await paymentService.updatePayment(selectedPayment._id, updates);
      toast.success("Payment updated successfully");
      setEditDialogOpen(false);
      onPaymentUpdate();
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error("Failed to update payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewReceipt = async (payment: Payment) => {
    setActionLoading(payment._id);
    try {
      // Get the receipt URL from backend
      const receiptUrl = await receiptService.regenerateReceipt(
        payment.reference
      );

      // Open the receipt URL in a new tab
      if (receiptUrl) {
        // If it's a relative URL, make it absolute
        const absoluteUrl = receiptUrl.startsWith("http")
          ? receiptUrl
          : `${window.location.origin}${receiptUrl}`;

        window.open(absoluteUrl, "_blank", "noopener,noreferrer");
        toast.success("Receipt opened in new tab");
      } else {
        toast.error("No receipt URL received");
      }
    } catch (error) {
      console.error("Failed to view receipt:", error);
      toast.error("Failed to generate receipt");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadReceipt = async (payment: Payment) => {
    setActionLoading(payment._id);
    try {
      // Get the PDF blob directly
      const blob = await receiptService.getReceiptPDF(payment.reference);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${payment.reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Failed to download receipt:", error);
      toast.error("Failed to download receipt");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendEmail = async (payment: Payment) => {
    if (!payment.email) {
      toast.error("No email address found for this payment");
      return;
    }

    setActionLoading(payment._id);
    try {
      await receiptService.resendReceiptEmail(payment.reference);
      toast.success(`Receipt sent to ${payment.email}`);
    } catch (error) {
      console.error("Failed to resend email:", error);
      toast.error("Failed to resend receipt email");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePayment = async (payment: Payment) => {
    setActionLoading(payment._id);
    try {
      await paymentService.deletePayment(payment._id);
      toast.success("Payment deleted successfully");
      setDeleteDialogOpen(false);
      onPaymentUpdate();
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast.error("Failed to delete payment");
    } finally {
      setActionLoading(null);
    }
  };

  // Add a direct view receipt function that uses the existing receipt if available
  const handleDirectViewReceipt = (payment: Payment) => {
    if (payment.receiptPdf) {
      // If receipt is already stored as base64, open it directly
      const pdfWindow = window.open("", "_blank");
      if (pdfWindow) {
        pdfWindow.document.write(`
          <html>
            <head><title>Receipt - ${payment.reference}</title></head>
            <body style="margin: 0;">
              <embed 
                width="100%" 
                height="100%" 
                src="data:application/pdf;base64,${payment.receiptPdf}" 
                type="application/pdf"
              />
            </body>
          </html>
        `);
        pdfWindow.document.close();
      }
    } else {
      // If no receipt stored, regenerate it
      handleViewReceipt(payment);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const DEPARTMENTS = [
    { value: "COMSSA", label: "Computer Science (COMSSA)" },
    { value: "SENIFSA", label: "Software Engineering (SENIFSA)" },
    { value: "CYDASA", label: "Cyber Security (CYDASA)" },
    { value: "ICITSA", label: "Information Technology (ICITSA)" },
  ];

  const LEVELS = [
    { value: "100", label: "Level 100" },
    { value: "200", label: "Level 200" },
    { value: "300", label: "Level 300" },
    { value: "400", label: "Level 400" },
  ];

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No payments found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          No payments match your current filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Student
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Details
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Payment
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.matricNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {payment.department}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Level {payment.level}
                      </Badge>
                      {payment.isExecutive && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-purple-100 text-purple-800"
                        >
                          Executive
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                    <Badge
                      variant={
                        payment.type === "college" ? "default" : "outline"
                      }
                      className={
                        payment.type === "college"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {payment.type}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {payment.reference}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(payment.paidAt)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleDirectViewReceipt(payment)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDownloadReceipt(payment)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </DropdownMenuItem>
                      {payment.email && (
                        <DropdownMenuItem
                          onClick={() => handleResendEmail(payment)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Email
                        </DropdownMenuItem>
                      )}
                      {canEditPayment(payment) && (
                        <DropdownMenuItem
                          onClick={() => handleEditPayment(payment)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Payment
                        </DropdownMenuItem>
                      )}
                      {canDeletePayment(payment) && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPayment(payment);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Payment
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Payment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricNumber">Matric Number</Label>
                <Input
                  id="matricNumber"
                  value={editForm.matricNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, matricNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={editForm.department}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={editForm.level}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={actionLoading === selectedPayment?._id}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={actionLoading === selectedPayment?._id}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {actionLoading === selectedPayment?._id
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this payment? This action cannot
              be undone.
            </p>
            {selectedPayment && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{selectedPayment.fullName}</div>
                <div className="text-sm text-gray-600">
                  {selectedPayment.matricNumber}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(selectedPayment.amount)} •{" "}
                  {selectedPayment.type}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading === selectedPayment?._id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedPayment && handleDeletePayment(selectedPayment)
              }
              disabled={actionLoading === selectedPayment?._id}
            >
              {actionLoading === selectedPayment?._id
                ? "Deleting..."
                : "Delete Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
