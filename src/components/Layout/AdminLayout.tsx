// Update src/components/Layout/AdminLayout.tsx
import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

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
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: "💰",
      permission: "canViewPayments",
    },
    {
      name: "Executives",
      href: "/admin/executives",
      icon: "👑",
      permission: "canManageAdmins",
    },
    {
      name: "Admin Management",
      href: "/admin/management",
      icon: "⚙️",
      permission: "canManageAdmins",
    },
  ].filter((item) => !item.permission || hasPermission(item.permission as any));

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  NACOS Admin
                </h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-3 text-base font-medium rounded-lg transition-colors ${
                      isCurrentPath(item.href)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {admin?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {admin?.role?.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-4 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo/Brand */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <h1 className="text-xl font-bold text-gray-900">
                NACOS Admin Portal
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isCurrentPath(item.href)
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin?.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {admin?.role?.replace("_", " ")}
                  </span>
                  {admin?.department && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 truncate max-w-[120px]">
                      {admin.department}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                className="ml-3 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <span className="text-xl">☰</span>
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  NACOS Admin
                </h1>
                <div className="hidden sm:flex items-center space-x-2 ml-4">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                    {admin?.role?.replace("_", " ")}
                  </span>
                  {admin?.department && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full truncate max-w-[140px]">
                      {admin.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-sm text-gray-700">
                Welcome, <span className="font-medium">{admin?.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors lg:hidden"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
