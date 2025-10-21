import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const ExecutivesInfo: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Shield className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">
        About Executive Privileges
      </AlertTitle>
      <AlertDescription className="text-blue-700">
        <ul className="space-y-1 text-sm">
          <li>• Executives receive special payment rates and privileges</li>
          <li>• Scope determines where executive privileges apply</li>
          <li>
            • Only Super Admins and authorized admins can manage executives
          </li>
          <li>• Executive status is checked during payment processing</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
