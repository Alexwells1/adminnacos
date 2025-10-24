// src/components/executives/AddExecutiveForm.tsx
import React, { useState } from "react";
import { executiveService } from "../../services/admin.service";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, User} from "lucide-react";
import { toast } from "sonner";

interface AddExecutiveFormProps {
  onExecutiveAdded: () => void;
}

const EXECUTIVE_SCOPES = [
  { value: "college", label: "college" },
  { value: "department", label: "department" },

];

export const AddExecutiveForm: React.FC<AddExecutiveFormProps> = ({
  onExecutiveAdded,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    scope: "",
  });

  const handleInputChange = (field: string, value: string) => {
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
      if (!formData.fullName || !formData.matricNumber || !formData.scope) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate matric number format (basic validation)
      if (!/^[A-Z0-9]+$/.test(formData.matricNumber.toUpperCase())) {
        toast.error("Please enter a valid matric number");
        return;
      }

      const executiveData = {
        fullName: formData.fullName.trim(),
        matricNumber: formData.matricNumber.toUpperCase().trim(),
        scope: formData.scope,
      };

      await executiveService.addExecutive(executiveData);

      toast.success("Executive added successfully");

      // Reset form and close dialog
      setFormData({
        fullName: "",
        matricNumber: "",
        scope: "",
      });
      setOpen(false);
      onExecutiveAdded();
    } catch (error: any) {
      console.error("Failed to add executive:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add executive";

      if (errorMessage.includes("already exists")) {
        toast.error("An executive with this matric number already exists");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      matricNumber: "",
      scope: "",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Stakeholder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Stakeholde
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter student's full name"
              required
            />
          </div>

          {/* Matric Number */}
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
              className="uppercase"
              required
            />
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label htmlFor="scope">
              Stakeholder Scope <span className="text-red-500">*</span>
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

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Executive"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
