// src/components/Layout/MainContent.tsx
import React from "react";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1">
      <div className="p-3 sm:p-4">
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
};
