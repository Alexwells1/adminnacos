// src/components/Layout/DesktopSidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<any>;
  }>;
  currentPath: string;
  onLogout: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  navigation,
  currentPath,
  onLogout,
}) => {
  const { admin } = useAuth();

  const isCurrentPath = (path: string) => currentPath === path;

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 border-r bg-background">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                  <img src="/logo.png" alt="logo" /> 
              </div>
              <div>
                <h1 className="text-lg font-bold">NACOS</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.name}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                  {admin?.role?.replace("_", " ")}
                </span>
                {admin?.department && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs  bg-green-100 text-green-800 truncate font-medium">
                    {admin.department}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="ml-2 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
