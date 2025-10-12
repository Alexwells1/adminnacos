// src/contexts/AuthContext.tsx
import React, { useState, useEffect } from "react";

import { adminAuthService } from "../services/admin.service";
import type { Admin } from "../types/admin.types";
import { AuthContext } from "./AuthContext.1";

export interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: keyof Admin["permissions"]) => boolean;
  isRole: (role: Admin["role"]) => boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const response = await adminAuthService.getProfile();
        setAdmin(response.admin);
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await adminAuthService.login(email, password);
    localStorage.setItem("adminToken", response.token);
    localStorage.setItem("adminData", JSON.stringify(response.admin));
    setAdmin(response.admin);
  };

  const logout = () => {
    adminAuthService.logout();
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
  };

  const hasPermission = (permission: keyof Admin["permissions"]): boolean => {
    return admin?.permissions[permission] || false;
  };

  const isRole = (role: Admin["role"]): boolean => {
    return admin?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{ admin, loading, login, logout, hasPermission, isRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
