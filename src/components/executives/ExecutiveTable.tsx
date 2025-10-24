// src/components/executives/ExecutiveTable.tsx
import React, { useState } from "react";
import type { Executive } from "../../types/admin.types";
import { executiveService } from "../../services/admin.service";
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
import { MoreVertical, Trash2, User, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ExecutiveTableProps {
  executives: Executive[];
  loading: boolean;
  onExecutiveUpdate: () => void;
  canManage: boolean;
}

export const ExecutiveTable: React.FC<ExecutiveTableProps> = ({
  executives,
  loading,
  onExecutiveUpdate,
  canManage,
}) => {
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDeleteExecutive = async (executive: Executive) => {
    setActionLoading(executive._id);
    try {
      await executiveService.removeExecutive(executive.matricNumber);
      toast.success("Stakeholder removed successfully");
      setDeleteDialogOpen(false);
      onExecutiveUpdate();
    } catch (error: any) {
      console.error("Failed to remove stakeholder:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to remove stakeholder";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // FIX: Properly type the variant mapping
  const getScopeBadgeVariant = (scope: string) => {
    const scopeVariants: {
      [key: string]: "default" | "destructive" | "outline" | "secondary";
    } = {
      president: "destructive",
      vice_president: "default",
      secretary: "secondary",
      treasurer: "outline",
      social_director: "default",
      academic_director: "secondary",
      sports_director: "outline",
      other: "secondary",
    };

    return scopeVariants[scope] || "outline";
  };

  const formatScopeLabel = (scope: string) => {
    return scope
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading && executives.length === 0) {
    return (
      <div className="space-y-3 p-6">
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

  if (executives.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No stakeholders found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          No stakeholders have been added yet.
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
                Stakeholder
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Matric Number
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Scope
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Added On
              </th>
              {canManage && (
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {executives.map((executive) => (
              <tr key={executive._id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {executive.fullName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-mono text-sm text-gray-900">
                    {executive.matricNumber}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {/* FIX: Ensure the variant prop gets the correct type */}
                  <Badge variant={getScopeBadgeVariant(executive.scope)}>
                    {formatScopeLabel(executive.scope)}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(executive.createdAt)}</span>
                  </div>
                </td>
                {canManage && (
                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedExecutive(executive);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Stakeholder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Stakeholder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this stakeholder? This action cannot
              be undone.
            </p>
            {selectedExecutive && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{selectedExecutive.fullName}</div>
                <div className="text-sm text-gray-600">
                  {selectedExecutive.matricNumber}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {selectedExecutive.scope.replace("_", " ")}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading === selectedExecutive?._id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedExecutive && handleDeleteExecutive(selectedExecutive)
              }
              disabled={actionLoading === selectedExecutive?._id}
            >
              {actionLoading === selectedExecutive?._id
                ? "Removing..."
                : "Remove Stakeholder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
