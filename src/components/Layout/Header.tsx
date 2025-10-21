// src/components/Layout/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";

interface HeaderProps {
  currentPage: string;
  onMenuClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onMenuClick,
  onLogout,
}) => {
  const { admin } = useAuth();

  return (
    <header className="bg-background border-b sticky top-0 z-30">
      <div className="flex items-center justify-between p-3">
        {/* Left side - Mobile: Only hamburger and page title */}
        <div className="flex items-center space-x-2 flex-1 lg:flex-none">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Show only page title on mobile */}
          <div className="lg:hidden">
            <h1 className="text-base font-semibold truncate">{currentPage}</h1>
          </div>

          {/* Desktop header content */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <h1 className="text-lg font-semibold">{currentPage}</h1>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full capitalize font-medium">
                {admin?.role?.replace("_", " ")}
              </span>
              {admin?.department && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full truncate font-medium">
                  {admin.department}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Mobile: Only user initial and logout button */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop: Full user info */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome,{" "}
              <span className="font-semibold text-foreground">
                {admin?.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
