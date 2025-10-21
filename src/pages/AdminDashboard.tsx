// src/pages/AdminDashboard.tsx
import React from "react";
import { useAuth } from "@/contexts/useAuth";


import { GeneralAdminDashboard } from "./dashboards/GeneralAdminDashboard";

import { DirectorFinanceDashboard } from "./dashboards/DirectorFinanceDashboard";
import SuperAdminDashboard from "./dashboards/SuperAdminDashboard";
import CollegeAdminDashboard from "./dashboards/CollegeAdminDashboard";
import DepartmentAdminDashboard from "./dashboards/DepartmentAdminDashboard";

export const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();

  switch (admin?.role) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "director_finance":
      return <DirectorFinanceDashboard />;
    case "general_admin":
      return <GeneralAdminDashboard />;
    case "college_admin":
      return <CollegeAdminDashboard />;
    case "dept_admin":
      return <DepartmentAdminDashboard />;
    default:
      return <GeneralAdminDashboard />;
  }
};
