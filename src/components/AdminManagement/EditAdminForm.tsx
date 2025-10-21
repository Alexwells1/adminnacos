// src/components/admin/EditAdminForm.tsx
import React, { useState } from "react";
import {
  type Admin,
  adminManagementService,
} from "../../services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Shield,
  Building,
  GraduationCap,
  UserCog,
  Mail,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface EditAdminFormProps {
  admin: Admin;
  onSuccess: () => void;
  onCancel: () => void;
}

// FIX: Use proper department values that match your types
const DEPARTMENTS = [
  { value: "COMSSA", label: "Computer Science (COMSSA)" },
  { value: "SENIFSA", label: "Software Engineering (SENIFSA)" },
  { value: "CYDASA", label: "Cyber Security (CYDASA)" },
  { value: "ICITSA", label: "Information Technology (ICITSA)" },
];

const ROLES = [
  { value: "super_admin", label: "Super Admin", icon: Shield },
  { value: "director_finance", label: "Director Finance", icon: UserCog },
  { value: "college_admin", label: "College Admin", icon: Building },
  { value: "dept_admin", label: "Department Admin", icon: GraduationCap },
  { value: "general_admin", label: "General Admin", icon: UserCog },
];

export const EditAdminForm: React.FC<EditAdminFormProps> = ({
  admin,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  // FIX: Properly type the form data to match UpdateAdminData
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    role: admin.role,
    department: admin.department || "",
    isActive: admin.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.role === "dept_admin" && !formData.department) {
      toast.error("Department is required for department admins");
      return;
    }

    setLoading(true);

    try {
      // FIX: Prepare data that matches UpdateAdminData type
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department as
          | "COMSSA"
          | "ICITSA"
          | "CYDASA"
          | "SENIFSA"
          | undefined,
        isActive: formData.isActive,
      };

      // Clear department if not dept_admin
      if (formData.role !== "dept_admin") {
        updateData.department = undefined;
      }

      await adminManagementService.updateAdmin(admin._id, updateData);
      onSuccess();
    } catch (error: any) {
      console.error("Failed to update admin:", error);
      toast.error(error.response?.data?.message || "Failed to update admin");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Clear department when role changes to non-dept_admin
      ...(field === "role" && value !== "dept_admin" && { department: "" }),
    }));
  };

  // FIX: Remove unused getRoleIcon function since it's not used in the component
  /*
  const getRoleIcon = (roleValue: string) => {
    const role = ROLES.find((r) => r.value === roleValue);
    return role
      ? React.createElement(role.icon, { className: "h-4 w-4" })
      : null;
  };
  */

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Admin
          </DialogTitle>
          <DialogDescription>
            Update administrator details and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      {React.createElement(role.icon, { className: "h-4 w-4" })}
                      {role.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department (only for dept_admin) */}
          {formData.role === "dept_admin" && (
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
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
          )}

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Account Status</Label>
              <div className="text-sm text-muted-foreground">
                {formData.isActive
                  ? "Admin can access the system"
                  : "Admin account is disabled"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formData.isActive ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Updating..." : "Update Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
