import  { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import  {Table, TableHeader, TableRow, TableCell, TableBody, TableFooter } from "@/components/ui/table";

import React from "react";


interface MaintenanceRow {
  account: string;
  payments: number;
  maintenanceCollected: number;
  expenses: number;
  available: number;
}

interface MaintenanceBreakdownTableProps {
  title: string;
  data: MaintenanceRow[];
}

export const MaintenanceBreakdownTable: React.FC<
  MaintenanceBreakdownTableProps
> = ({ title, data }) => {
  const totalPayments = data.reduce((sum, row) => sum + row.payments, 0);
  const totalMaintenance = data.reduce(
    (sum, row) => sum + row.maintenanceCollected,
    0
  );
  const totalExpenses = data.reduce((sum, row) => sum + row.expenses, 0);
  const totalAvailable = data.reduce((sum, row) => sum + row.available, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="text-xs font-medium">Account</TableCell>
                <TableCell className="text-xs font-medium text-right">
                  Payments
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  Maintenance Collected
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  Expenses
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  Available Balance
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50">
                  <TableCell className="text-xs py-2">{row.account}</TableCell>
                  <TableCell className="text-xs py-2 text-right">
                    {row.payments.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs py-2 text-right">
                    ₦{row.maintenanceCollected.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs py-2 text-right">
                    ₦{row.expenses.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs py-2 text-right">
                    ₦{row.available.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-xs font-medium">Total</TableCell>
                <TableCell className="text-xs font-medium text-right">
                  {totalPayments.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  ₦{totalMaintenance.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  ₦{totalExpenses.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  ₦{totalAvailable.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
