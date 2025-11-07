// src/components/Payments/CreateManualPayment.tsx
import React, { useEffect, useMemo, useState } from "react";
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

// Constants
const DEPARTMENTS = [
  { value: "Computer Science", label: "Computer Science (COMSSA)" },
  {
    value: "Software Engr & Information Systems",
    label: "Software Engineering (SENIFSA)",
  },
  { value: "Cybersecurity & Data Science", label: "Cyber Security (CYDASA)" },
  {
    value: "ICT & Information Technology",
    label: "Information Technology (ICITSA)",
  },
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

  // Calculate amount based on type, level, and executive status
  const calculateAmount = () => {
    const { type, level, isExecutive } = formData;
    if (!type || !level) return "";

    let baseAmount = 0;

    if (type === "college") {
      baseAmount = level === "100" || level === "200 D.E" ? 5000 : 4000;
    } else {
      baseAmount = level === "100" || level === "200 D.E" ? 4500 : 3500;
    }

    if (isExecutive) {
      // Halve the amount for executives
      baseAmount = baseAmount / 2;
    }

    return baseAmount.toString();
  };

  // Update amount whenever relevant fields change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: calculateAmount(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.type, formData.level, formData.isExecutive, formData.scope]);

  // Allowed payment types based on admin role
  const allowedPaymentTypes = useMemo(() => {
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
  }, [admin?.role]);

  // Auto-select payment type if only one allowed
  useEffect(() => {
    if (
      allowedPaymentTypes.length === 1 &&
      formData.type !== allowedPaymentTypes[0].value
    ) {
      setFormData((prev) => ({
        ...prev,
        type: allowedPaymentTypes[0].value,
      }));
    }
  }, [allowedPaymentTypes, formData.type]);

  // Auto-fill & lock department for dept_admin
  useEffect(() => {
    if (admin?.role === "dept_admin") {
      setFormData((prev) => ({
        ...prev,
        department: admin.department ?? "",
      }));
    }
  }, [admin]);

  // Auto-select executive scope for dept_admin / college_admin
  useEffect(() => {
    if (formData.isExecutive) {
      if (admin?.role === "dept_admin") {
        setFormData((prev) => ({ ...prev, scope: "department" }));
      } else if (admin?.role === "college_admin") {
        setFormData((prev) => ({ ...prev, scope: "college" }));
      }
    } else if (!formData.isExecutive && formData.scope) {
      setFormData((prev) => ({ ...prev, scope: "" }));
    }
  }, [formData.isExecutive, admin, formData.scope]);

  // Restrict access for unauthorized roles
  const hasAccess = admin && !["viewer", "student_admin"].includes(admin.role);
  if (!hasAccess) {
    return null;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) {
      toast.error("Admin not found");
      return;
    }

    setLoading(true);
    try {
      if (
        !formData.fullName ||
        !formData.matricNumber ||
        !formData.amount ||
        !formData.type
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.type === "departmental" && !formData.department) {
        toast.error("Department is required for departmental payments");
        return;
      }

      if (formData.isExecutive && !formData.scope) {
        toast.error("Executive scope is required for executive payments");
        return;
      }

      const paymentData = {
        fullName: formData.fullName,
        matricNumber: formData.matricNumber,
        department: formData.department as
          | "Computer Science"
          | "ICT & Information Technology"
          | "Cybersecurity & Data Science"
          | "Software Engr & Information Systems",
        level: formData.level,
        amount: parseFloat(formData.amount),
        type: formData.type as "college" | "departmental",
        email: formData.email || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        isExecutive: formData.isExecutive,
        scope: formData.isExecutive ? formData.scope : undefined,
        createdBy: admin._id,
        createdByRole: admin.role,
      };

      await paymentService.createManualPayment(paymentData);
      toast.success("Manual payment created successfully");

      // Reset form
      setFormData({
        fullName: "",
        matricNumber: "",
        department: admin.role === "dept_admin" ? admin.department || "" : "",
        level: "",
        amount: "",
        type:
          allowedPaymentTypes.length === 1 ? allowedPaymentTypes[0].value : "",
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
      department: admin.role === "dept_admin" ? admin.department || "" : "",
      level: "",
      amount: "",
      type:
        allowedPaymentTypes.length === 1 ? allowedPaymentTypes[0].value : "",
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
              <User className="h-5 w-5" /> Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter student's full name"
                  required
                />
              </div>
              <div>
                <Label>
                  Matric Number <span className="text-red-500">*</span>
                </Label>
                <Input
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
              <div>
                <Label>
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
                    {LEVELS.map((lvl) => (
                      <SelectItem key={lvl.value} value={lvl.value}>
                        {lvl.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
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
                  disabled={admin.role === "dept_admin"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
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
              <CreditCard className="h-5 w-5" /> Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Payment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                  disabled={allowedPaymentTypes.length === 1}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedPaymentTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
                  Amount (₦) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.amount}
                  readOnly
                  placeholder="Auto-calculated"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Mail className="h-5 w-5" /> Contact Information (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
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
              <div>
                <Label>
                  Executive Scope <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.scope}
                  onValueChange={(value) => handleInputChange("scope", value)}
                  disabled={
                    admin.role === "dept_admin" ||
                    admin.role === "college_admin"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select executive scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXECUTIVE_SCOPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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
