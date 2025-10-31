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
    <header className="sticky top-0 z-30 bg-card border-b border-border text-foreground">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-2 flex-1 lg:flex-none">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent hover:text-accent-foreground"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Page Title */}
          <div className="lg:hidden">
            <h1 className="text-base font-semibold truncate">{currentPage}</h1>
          </div>

          {/* Desktop Page Title + Role/Dept */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <h1 className="text-lg font-semibold text-foreground">
              {currentPage}
            </h1>
            <div className="flex items-center space-x-2">
              {admin?.role && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground capitalize font-medium">
                  {admin.role.replace("_", " ")}
                </span>
              )}
              {admin?.department && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground truncate font-medium">
                  {admin.department}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Mobile User Avatar + Logout */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {admin?.name?.charAt(0) || "A"}
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

          {/* Desktop: Welcome message + Logout */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome,&nbsp;
              <span className="font-semibold text-foreground">
                {admin?.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-all"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
