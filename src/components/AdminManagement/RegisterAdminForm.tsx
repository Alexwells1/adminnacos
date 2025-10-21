// src/components/admin/CreateAdminForm.tsx
import React, { useState } from "react";
import { adminManagementService } from "../../services/admin.service";
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
import {
  Shield,
  Building,
  GraduationCap,
  UserCog,
  Eye,
  EyeOff,
  Mail,
  User,
  Key,
} from "lucide-react";
import { toast } from "sonner";

interface CreateAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// FIX: Use proper department enum values that match your types
const DEPARTMENTS = [
  { value: "COMSSA", label: "Computer Science (COMSSA)" },
  { value: "SENIFSA", label: "Software Engineering (SENIFSA)" },
  { value: "CYDASA", label: "Cyber Security (CYDASA)" },
  { value: "ICITSA", label: "Information Technology (ICITSA)" },
];

const ROLES = [
  {
    value: "super_admin",
    label: "Super Admin",
    icon: Shield,
    description: "Full system access",
  },
  {
    value: "director_finance",
    label: "Director Finance",
    icon: UserCog,
    description: "Financial management",
  },
  {
    value: "college_admin",
    label: "College Admin",
    icon: Building,
    description: "College-level access",
  },
  {
    value: "dept_admin",
    label: "Department Admin",
    icon: GraduationCap,
    description: "Department-specific access",
  },
  {
    value: "general_admin",
    label: "General Admin",
    icon: UserCog,
    description: "Basic admin access",
  },
];

export const CreateAdminForm: React.FC<CreateAdminFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.role === "dept_admin" && !formData.department) {
      toast.error("Department is required for department admins");
      return;
    }

    setLoading(true);

    try {
      // FIX: Prepare data with proper department type
      const createData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as any,
        department: formData.department as
          | "COMSSA"
          | "ICITSA"
          | "CYDASA"
          | "SENIFSA"
          | undefined,
      };

      // Clear department if not dept_admin
      if (formData.role !== "dept_admin") {
        createData.department = undefined;
      }

      await adminManagementService.registerAdmin(createData);

      onSuccess();
    } catch (error: any) {
      console.error("Failed to create admin:", error);
      toast.error(error.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Clear department when role changes to non-dept_admin
      ...(field === "role" && value !== "dept_admin" && { department: "" }),
    }));
  };

  // FIX: Remove unused getRoleIcon function since it's not used
  /*
  const getRoleIcon = (roleValue: string) => {
    const role = ROLES.find(r => r.value === roleValue);
    return role ? React.createElement(role.icon, { className: "h-4 w-4" }) : null;
  };
  */

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create New Admin
          </DialogTitle>
          <DialogDescription>
            Add a new administrator to the system with specific permissions and
            access levels.
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

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10"
                disabled={loading}
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
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
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
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

          {/* Role Permissions Preview */}
          {formData.role && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium text-sm mb-2">Permissions Preview</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                {formData.role === "super_admin" && (
                  <>
                    <div>• Full system access and administration</div>
                    <div>• Can manage all admins and settings</div>
                    <div>• Access to all financial data</div>
                  </>
                )}
                {formData.role === "director_finance" && (
                  <>
                    <div>• Financial management and reporting</div>
                    <div>• Expense approval and tracking</div>
                    <div>• Revenue analysis and statistics</div>
                  </>
                )}
                {formData.role === "college_admin" && (
                  <>
                    <div>• College-level payment management</div>
                    <div>• College financial overview</div>
                    <div>• College student data access</div>
                  </>
                )}
                {formData.role === "dept_admin" && (
                  <>
                    <div>• Department-specific payment management</div>
                    <div>• Department student data access</div>
                    <div>
                      • Limited to{" "}
                      {formData.department || "selected department"}
                    </div>
                  </>
                )}
                {formData.role === "general_admin" && (
                  <>
                    <div>• Basic administrative functions</div>
                    <div>• Payment viewing and management</div>
                    <div>• Limited system access</div>
                  </>
                )}
              </div>
            </div>
          )}

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
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
