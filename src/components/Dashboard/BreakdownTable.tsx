// components/dashboard/BreakdownTable.tsx
import React from "react";
import type {
  RevenueBreakdownItem,
  ExecutiveVsRegularItem,
} from "@/types/admin.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Users, PieChart, DollarSign, CreditCard } from "lucide-react";

type BreakdownData = RevenueBreakdownItem | ExecutiveVsRegularItem;

interface BreakdownTableProps {
  title: string;
  data: BreakdownData[];
  type?: "department" | "level" | "type" | "executive";
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({
  title,
  data,
  type = "department",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safely default revenue and count
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalCount = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const getHeaderName = () => {
    switch (type) {
      case "department":
        return "Department";
      case "level":
        return "Level";
      case "executive":
        return "Type";
      default:
        return "Type";
    }
  };

  const getIcon = (id: string | boolean | null) => {
    if (id === "COMSSA") return <Users className="w-4 h-4 text-blue-500" />;
    if (id === "ICITSA") return <Users className="w-4 h-4 text-green-500" />;
    if (id === "CYDASA") return <Users className="w-4 h-4 text-purple-500" />;
    if (id === "SENIFSA") return <Users className="w-4 h-4 text-orange-500" />;
    if (id === "college") return <PieChart className="w-4 h-4 text-teal-500" />;
    if (typeof id === "boolean")
      return <CreditCard className="w-4 h-4 text-purple-500" />;
    return <DollarSign className="w-4 h-4 text-gray-500" />;
  };

  const getDisplayName = (id: string | boolean | null): string => {
    if (id === null || id === undefined) return "Unknown";
    if (typeof id === "boolean") return id ? "Executive" : "Regular";
    if (id === "college") return "College";
    if (id === "departmental") return "Departmental";
    return id.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">#</TableHead>
              <TableHead className="text-xs">{getHeaderName()}</TableHead>
              <TableHead className="text-xs text-right">Payments</TableHead>
              <TableHead className="text-xs text-right">Revenue (₦)</TableHead>
              <TableHead className="text-xs text-right">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const count = item.count ?? 0;
              const revenue = item.revenue ?? 0;
              const percent =
                totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

              return (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="text-xs py-2">{index + 1}</TableCell>
                  <TableCell className="text-xs py-2 flex items-center gap-1">
                    {getIcon(item._id)} {getDisplayName(item._id)}
                  </TableCell>
                  <TableCell className="text-xs text-right py-2">
                    {count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right py-2">
                    ₦{revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right py-2 w-24">
                    <div className="flex items-center gap-1">
                      <span>{percent.toFixed(1)}%</span>
                      <Progress
                        value={percent}
                        className="flex-1 h-2 rounded-full"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-muted/50">
              <TableCell className="text-xs font-medium py-2" colSpan={2}>
                Total
              </TableCell>
              <TableCell className="text-xs font-medium text-right py-2">
                {totalCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-xs font-medium text-right py-2">
                ₦{totalRevenue.toLocaleString()}
              </TableCell>
              <TableCell className="text-xs font-medium text-right py-2">
                100%
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};
