import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center p-0 pb-4">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-lg">Error Loading Data</CardTitle>
          <CardDescription>
            Failed to load dashboard data. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Button onClick={onRetry} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
