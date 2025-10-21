import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DepartmentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  overviewContent: React.ReactNode;
  levelsContent: React.ReactNode;
  studentsContent: React.ReactNode;
  recentContent: React.ReactNode;
}

export const DepartmentTabs: React.FC<DepartmentTabsProps> = ({
  activeTab,
  onTabChange,
  overviewContent,
  levelsContent,
  studentsContent,
  recentContent,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        <TabsTrigger value="overview" className="text-sm py-2">
          Overview
        </TabsTrigger>
        <TabsTrigger value="levels" className="text-sm py-2">
          Levels
        </TabsTrigger>
        <TabsTrigger value="students" className="text-sm py-2">
          Students
        </TabsTrigger>
        <TabsTrigger value="recent" className="text-sm py-2">
          Recent
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        {overviewContent}
      </TabsContent>

      <TabsContent value="levels" className="space-y-6 mt-6">
        {levelsContent}
      </TabsContent>

      <TabsContent value="students" className="space-y-6 mt-6">
        {studentsContent}
      </TabsContent>

      <TabsContent value="recent" className="space-y-6 mt-6">
        {recentContent}
      </TabsContent>
    </Tabs>
  );
};
