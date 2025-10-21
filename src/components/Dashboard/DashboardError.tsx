import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  retryText?: string;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({
  title = "Error Loading Data",
  message = "Failed to load dashboard data. Please try again.",
  onRetry,
  retryText = "Try Again",
}) => {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center p-0 pb-4">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Button onClick={onRetry} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            {retryText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
