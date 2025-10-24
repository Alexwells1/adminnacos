// src/components/Layout/AdminLayout.tsx
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  Receipt,
} from "lucide-react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Header } from "./Header";
import { MainContent } from "./MainContent";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      permission: undefined,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      permission: "canViewPayments",
    },
    {
      name: "Stakeholders",
      href: "/admin/executives",
      icon: Users,
      permission: "canManageAdmins",
    },
    {
      name: "Admin Management",
      href: "/admin/management",
      icon: Settings,
      permission: "canManageAdmins",
    },
    {
      name: "Expenses",
      href: "/admin/expenses",
      icon: Receipt,
      permission: "canViewAnalytics",
    },
  ].filter((item) => !item.permission || hasPermission(item.permission as any));

  const currentPage =
    navigation.find((item) => location.pathname === item.href)?.name ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar
        navigation={navigation}
        currentPath={location.pathname}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <Header
          currentPage={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />

        {/* Main Content */}
        <MainContent>{children}</MainContent>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
        navigation={navigation}
        currentPath={location.pathname}
        onLogout={logout}
      />
    </div>
  );
};
