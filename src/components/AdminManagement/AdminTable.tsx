// src/components/admin/AdminManagementTable.tsx
import React, { useState } from "react";
import type { Admin } from "../../services/admin.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Building,
  GraduationCap,
  UserCog,
  UserX,
  UserCheck,
  Mail,
  Users,
  Key,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

import { adminManagementService } from "../../services/admin.service";
import { toast } from "sonner";
import { EditAdminForm } from "./EditAdminForm";
import { ChangePasswordDialog } from "./ChangePasswordDialog";


interface AdminManagementTableProps {
  admins: Admin[];
  loading: boolean;
  currentAdminId?: string;
  onAdminUpdated: () => void;
  onAdminDeleted: () => void;
  onStatusToggle: () => void;
  onRefetch: () => void;
}

export const AdminManagementTable: React.FC<AdminManagementTableProps> = ({
  admins,
  loading,
  currentAdminId,
  onAdminUpdated,
  onAdminDeleted,
  onStatusToggle,
  onRefetch,
}) => {
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [togglingAdmin, setTogglingAdmin] = useState<Admin | null>(null);
  const [changingPasswordAdmin, setChangingPasswordAdmin] =
    useState<Admin | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Shield className="h-4 w-4" />;
      case "college_admin":
        return <Building className="h-4 w-4" />;
      case "dept_admin":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <UserCog className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      super_admin: "bg-purple-100 text-purple-800 border-purple-200",
      director_finance: "bg-blue-100 text-blue-800 border-blue-200",
      college_admin: "bg-green-100 text-green-800 border-green-200",
      dept_admin: "bg-orange-100 text-orange-800 border-orange-200",
      general_admin: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        variant="outline"
        className={`capitalize ${variants[role as keyof typeof variants]}`}
      >
        <span className="flex items-center gap-1">
          {getRoleIcon(role)}
          {role.replace("_", " ")}
        </span>
      </Badge>
    );
  };

  const handleToggleStatus = async (admin: Admin) => {
    try {
      await adminManagementService.toggleAdminStatus(admin._id);
      onStatusToggle();
      toast.success(
        `Admin ${admin.isActive ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      console.error("Failed to toggle admin status:", error);
      toast.error("Failed to update admin status");
    } finally {
      setTogglingAdmin(null);
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    try {
      await adminManagementService.deleteAdmin(admin._id);
      onAdminDeleted();
      toast.success("Admin deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin");
    } finally {
      setDeletingAdmin(null);
    }
  };

  const handlePasswordChange = async (adminId: string, newPassword: string) => {
    try {
      await adminManagementService.changeAdminPassword(adminId, newPassword);
      toast.success("Password changed successfully");
      setChangingPasswordAdmin(null);
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
      throw error; // Re-throw to let the dialog handle it
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8" />
                    <p>No administrators found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell>
                    {admin.department ? (
                      <Badge variant="secondary" className="capitalize">
                        {admin.department}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.isActive ? "default" : "secondary"}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setEditingAdmin(admin)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setChangingPasswordAdmin(admin)}
                          disabled={admin._id === currentAdminId}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setTogglingAdmin(admin)}
                          disabled={admin._id === currentAdminId}
                        >
                          {admin.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setDeletingAdmin(admin)}
                          disabled={admin._id === currentAdminId}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Admin Dialog */}
      {editingAdmin && (
        <EditAdminForm
          admin={editingAdmin}
          onSuccess={() => {
            setEditingAdmin(null);
            onAdminUpdated();
          }}
          onCancel={() => setEditingAdmin(null)}
        />
      )}

      {/* Change Password Dialog */}
      {changingPasswordAdmin && (
        <ChangePasswordDialog
          admin={changingPasswordAdmin}
          onSuccess={() => {
            setChangingPasswordAdmin(null);
            toast.success("Password changed successfully");
          }}
          onCancel={() => setChangingPasswordAdmin(null)}
          onChangePassword={handlePasswordChange}
        />
      )}

      {/* Toggle Status Confirmation */}
      <AlertDialog
        open={!!togglingAdmin}
        onOpenChange={() => setTogglingAdmin(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {togglingAdmin?.isActive
                ? "Deactivate Admin?"
                : "Activate Admin?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {togglingAdmin?.isActive
                ? `This will deactivate ${togglingAdmin.name}. They will no longer be able to access the system.`
                : `This will activate ${togglingAdmin?.name}. They will be able to access the system with their current permissions.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => togglingAdmin && handleToggleStatus(togglingAdmin)}
              className={
                togglingAdmin?.isActive
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {togglingAdmin?.isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingAdmin}
        onOpenChange={() => setDeletingAdmin(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deletingAdmin?.name}'s account and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAdmin && handleDeleteAdmin(deletingAdmin)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
