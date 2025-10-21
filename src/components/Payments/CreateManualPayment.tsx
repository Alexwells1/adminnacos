// src/components/Payments/CreateManualPayment.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { paymentService } from "../../services/admin.service";
import { useAuth } from "@/contexts/useAuth";
import { Plus, CreditCard, User, Mail } from "lucide-react";
import { toast } from "sonner";

interface CreateManualPaymentProps {
  onPaymentCreated: () => void;
}

// FIX: Use proper department enum values that match your types
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

const PAYMENT_TYPES = [
  { value: "college", label: "College Payment" },
  { value: "departmental", label: "Departmental Payment" },
];

const EXECUTIVE_SCOPES = [
  { value: "college", label: "college" },
  { value: "department", label: "department" },
];

export const CreateManualPayment: React.FC<CreateManualPaymentProps> = ({
  onPaymentCreated,
}) => {
  const { admin } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    department: "",
    level: "",
    amount: "",
    type: "",
    email: "",
    phoneNumber: "",
    isExecutive: false,
    scope: "",
  });

  // Determine allowed payment types and departments based on role
  const getAllowedPaymentTypes = () => {
    if (admin?.role === "super_admin" || admin?.role === "director_finance") {
      return PAYMENT_TYPES;
    }
    if (admin?.role === "college_admin") {
      return PAYMENT_TYPES.filter((type) => type.value === "college");
    }
    if (admin?.role === "dept_admin") {
      return PAYMENT_TYPES.filter((type) => type.value === "departmental");
    }
    return [];
  };

  // FIX: Remove unused allowedDepartments variable
  const allowedPaymentTypes = getAllowedPaymentTypes();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.matricNumber ||
        !formData.amount ||
        !formData.type
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate department for departmental payments
      if (formData.type === "departmental" && !formData.department) {
        toast.error("Department is required for departmental payments");
        return;
      }

      // Validate scope for executive payments
      if (formData.isExecutive && !formData.scope) {
        toast.error("Executive scope is required for executive payments");
        return;
      }

      // FIX: Prepare payment data with proper department type
      const paymentData = {
        fullName: formData.fullName,
        matricNumber: formData.matricNumber,
        department: formData.department as
          | "COMSSA"
          | "ICITSA"
          | "CYDASA"
          | "SENIFSA", // Type assertion
        level: formData.level,
        amount: parseFloat(formData.amount),
        type: formData.type as "college" | "departmental",
        email: formData.email || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        isExecutive: formData.isExecutive,
        scope: formData.isExecutive ? formData.scope : undefined,
      };

      await paymentService.createManualPayment(paymentData);

      toast.success("Manual payment created successfully");

      // Reset form and close dialog
      setFormData({
        fullName: "",
        matricNumber: "",
        department: "",
        level: "",
        amount: "",
        type: "",
        email: "",
        phoneNumber: "",
        isExecutive: false,
        scope: "",
      });
      setOpen(false);
      onPaymentCreated();
    } catch (error: any) {
      console.error("Failed to create manual payment:", error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while creating the payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      matricNumber: "",
      department: "",
      level: "",
      amount: "",
      type: "",
      email: "",
      phoneNumber: "",
      isExecutive: false,
      scope: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Manual Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Create Manual Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricNumber">
                  Matric Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="matricNumber"
                  value={formData.matricNumber}
                  onChange={(e) =>
                    handleInputChange("matricNumber", e.target.value)
                  }
                  placeholder="Enter matric number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">
                  Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
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

              <div className="space-y-2">
                <Label htmlFor="department">
                  Department{" "}
                  {formData.type === "departmental" && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
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
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Payment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedPaymentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount (₦) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Executive Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Executive Status</h3>
                <p className="text-sm text-gray-600">
                  Mark if this student is an executive
                </p>
              </div>
              <Switch
                checked={formData.isExecutive}
                onCheckedChange={(checked) =>
                  handleInputChange("isExecutive", checked)
                }
              />
            </div>

            {formData.isExecutive && (
              <div className="space-y-2">
                <Label htmlFor="scope">
                  Executive Scope <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.scope}
                  onValueChange={(value) => handleInputChange("scope", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select executive scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXECUTIVE_SCOPES.map((scope) => (
                      <SelectItem key={scope.value} value={scope.value}>
                        {scope.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating Payment..." : "Create Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
