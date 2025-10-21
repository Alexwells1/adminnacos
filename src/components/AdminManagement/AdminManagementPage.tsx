// src/pages/AdminManagement.tsx

import { type Admin, adminManagementService } from "@/services/admin.service";
import {
  Shield,
  Building,
  GraduationCap,
  UserCog,
  Users,
  Plus,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { AdminManagementTable } from "./AdminTable";
import { CreateAdminForm } from "./RegisterAdminForm";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";
import { Badge } from "../ui/badge";

export const AdminManagementPage: React.FC = () => {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    }
  }, [isSuperAdmin, refetchTrigger]);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminManagementService.getAllAdmins();
      // FIX: Extract admins array from response
      setAdmins(response.admins || response || []);
    } catch (error: any) {
      console.error("Failed to load admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCreated = () => {
    setShowCreateForm(false);
    setRefetchTrigger((prev) => prev + 1);
    toast.success("Admin created successfully");
  };

  const handleAdminUpdated = () => {
    setRefetchTrigger((prev) => prev + 1);
    toast.success("Admin updated successfully");
  };

  const handleAdminDeleted = () => {
    setRefetchTrigger((prev) => prev + 1);
    toast.success("Admin deleted successfully");
  };

  const handleStatusToggle = () => {
    setRefetchTrigger((prev) => prev + 1);
    toast.success("Admin status updated");
  };

  if (!isSuperAdmin) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need super admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    const variants: { [key: string]: string } = {
      super_admin: "bg-purple-100 text-purple-800 border-purple-200",
      director_finance: "bg-blue-100 text-blue-800 border-blue-200",
      college_admin: "bg-green-100 text-green-800 border-green-200",
      dept_admin: "bg-orange-100 text-orange-800 border-orange-200",
      general_admin: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        variant="outline"
        className={
          variants[role] || "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        <span className="flex items-center gap-1">
          {getRoleIcon(role)}
          {role.replace("_", " ")}
        </span>
      </Badge>
    );
  };

  const stats = {
    total: admins.length,
    active: admins.filter((a) => a.isActive).length,
    superAdmins: admins.filter((a) => a.role === "super_admin").length,
    deptAdmins: admins.filter((a) => a.role === "dept_admin").length,
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system administrators and their permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.superAdmins}</div>
            <p className="text-xs text-muted-foreground">Full system access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dept Admins</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deptAdmins}</div>
            <p className="text-xs text-muted-foreground">Department-specific</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0
                ? Math.round((stats.active / stats.total) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Of admins are active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              admins.reduce((acc, admin) => {
                acc[admin.role] = (acc[admin.role] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([role, count]) => (
              <div
                key={role}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
              >
                {getRoleBadge(role)}
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Admin Form Modal */}
      {showCreateForm && (
        <CreateAdminForm
          onSuccess={handleAdminCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>
            Manage all system administrators and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminManagementTable
            admins={admins}
            loading={loading}
            currentAdminId={currentAdmin?._id}
            onAdminUpdated={handleAdminUpdated}
            onAdminDeleted={handleAdminDeleted}
            onStatusToggle={handleStatusToggle}
            onRefetch={loadAdmins}
          />
        </CardContent>
      </Card>
    </div>
  );
};
