// src/components/Layout/MobileSidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<any>;
  }>;
  currentPath: string;
  onLogout: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onOpenChange,
  navigation,
  currentPath,
  onLogout,
}) => {
  const { admin } = useAuth();

  const isCurrentPath = (path: string) => currentPath === path;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="p-0 bg-background w-full sm:max-w-sm"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-muted">
                <img src="/logo.png" alt="logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">NACOS</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 w-full",
                    isActive
                      ? "bg-muted text-foreground border border-border"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {admin?.name}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground capitalize">
                    {admin?.role?.replace("_", " ")}
                  </span>
                  {admin?.department && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted/70 text-foreground truncate">
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
      </SheetContent>
    </Sheet>
  );
};
