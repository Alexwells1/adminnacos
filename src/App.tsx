// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";
import { AdminLogin } from "./pages/AdminLogin";

import { AdminLayout } from "./components/Layout/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PaymentsPage } from "./pages/PaymentsPage";
import { ExecutivesPage } from "./pages/ExecutivesPage";
import { AdminManagementPage } from "./components/AdminManagement/AdminManagementPage";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return admin ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <Navigate to="/admin/login" />
  );
};

// Public Route component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !admin ? <>{children}</> : <Navigate to="/admin/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route
            path="/admin/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/executives"
            element={
              <ProtectedRoute>
                <ExecutivesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/management"
            element={
              <ProtectedRoute>
                <AdminManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Add more routes as we build them */}
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
