// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminLayout } from "./components/Layout/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PaymentsPage } from "./pages/PaymentsPage";
import { ExecutivesPage } from "./pages/ExecutivesPage";
import { AdminManagementPage } from "./components/AdminManagement/AdminManagementPage";
import { ExpenseManagement } from "./pages/ExpenseManagement";
import { AuthProvider } from "./contexts/useAuthcont";
import { CacheProvider } from "./contexts/useCache";
import { useAuth } from "./contexts/useAuth";
import { Toaster } from "sonner";
import PublicStatistics from "./components/census/censusStats";

// Route persistence component
const RoutePersist: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  // Store current route in sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem("lastRoute", location.pathname);
  }, [location]);

  return <>{children}</>;
};

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
    <>
      <AuthProvider>
        <CacheProvider>
          <RoutePersist>
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

              <Route
                path="/admin/expenses"
                element={
                  <ProtectedRoute>
                    <ExpenseManagement />
                  </ProtectedRoute>
                }
              />

              <Route
              path="census-stats"
              element={
                <PublicStatistics/>
              }/>

              {/* Add more routes as we build them */}
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </RoutePersist>
        </CacheProvider>
      </AuthProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
