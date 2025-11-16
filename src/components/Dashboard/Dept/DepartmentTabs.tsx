import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, PieChart, Users, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const tabs = [
    {
      value: "overview",
      icon: <Home className="w-5 h-5" />,
      label: "Overview",
      content: overviewContent,
    },
    {
      value: "levels",
      icon: <PieChart className="w-5 h-5" />,
      label: "Levels",
      content: levelsContent,
    },
    {
      value: "students",
      icon: <Users className="w-5 h-5" />,
      label: "Students",
      content: studentsContent,
    },
    {
      value: "recent",
      icon: <FileText className="w-5 h-5" />,
      label: "Recent",
      content: recentContent,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        {tabs.map((tab) => (
          <Tooltip key={tab.value}>
            <TooltipTrigger asChild>
              <TabsTrigger
                value={tab.value}
                className="flex justify-center py-2"
              >
                {tab.icon}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>{tab.label}</TooltipContent>
          </Tooltip>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="space-y-6 mt-6"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
