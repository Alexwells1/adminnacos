// src/contexts/useAuth.tsx
import type { Admin } from "@/services/admin.service";
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Define the permissions type based on your Admin interface
export interface AdminPermissions {
  canViewPayments: boolean;
  canExportData: boolean;
  canManageAdmins: boolean;
  canViewAnalytics: boolean;
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  isRole: (role: string | string[]) => boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminData");

    if (storedToken && storedAdmin) {
      try {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error("Error parsing stored admin data:", error);
        // Clear invalid stored data
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      }
    }
    setLoading(false);
  }, []);

  const login = (adminData: Admin, authToken: string) => {
    setAdmin(adminData);
    setToken(authToken);
    localStorage.setItem("adminToken", authToken);
    localStorage.setItem("adminData", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!admin) return false;

    // Super admin has all permissions
    if (admin.role === "super_admin") return true;

    // Check specific permission
    return admin.permissions?.[permission] || false;
  };

   const isRole = (role: string | string[]): boolean => {
     if (!admin) return false;

     if (Array.isArray(role)) {
       return role.includes(admin.role);
     }

     return admin.role === role;
   };

  const value: AuthContextType = {
    admin,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!admin && !!token,
    hasPermission,
    isRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
