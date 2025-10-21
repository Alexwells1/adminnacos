// components/dashboard/BreakdownTable.tsx
import type {
  RevenueBreakdownItem,
  ExecutiveVsRegularItem,
} from "@/types/admin.types";
import React from "react";
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
  const getDisplayName = (id: string | boolean | null): string => {
    if (id === null || id === undefined) return "Unknown";
    if (typeof id === "boolean") return id ? "Executive" : "Regular";
    if (id === "college") return "College";
    if (id === "departmental") return "Departmental";
    return id.toString();
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

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

  if (data.length === 0) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{getHeaderName()}</TableHead>
                <TableHead className="text-xs text-right">Payments</TableHead>
                <TableHead className="text-xs text-right">Revenue</TableHead>
                <TableHead className="text-xs text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="text-xs font-medium py-2">
                    {getDisplayName(item._id)}
                  </TableCell>
                  <TableCell className="text-xs text-right py-2">
                    {item.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right py-2">
                    ₦{item.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right py-2">
                    {totalRevenue > 0
                      ? ((item.revenue / totalRevenue) * 100).toFixed(1)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-xs font-medium py-2">
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
        </div>
      </CardContent>
    </Card>
  );
};
