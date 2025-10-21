import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2 } from "lucide-react";
import type { Expense } from "@/types/expense.types";

const ACCOUNT_CONFIG = {
  college_general: {
    name: "College General Fund",
    icon: "Building",
    description: "College dues and expenses",
    color: "blue",
  },
  dept_comssa: {
    name: "COMSSA Department",
    icon: "Users",
    description: "Computer Science department",
    color: "green",
  },
  dept_icitsa: {
    name: "ICITSA Department",
    icon: "Users",
    description: "Information Technology department",
    color: "purple",
  },
  dept_cydasa: {
    name: "CYDASA Department",
    icon: "Shield",
    description: "Cyber Security department",
    color: "red",
  },
  dept_senifsa: {
    name: "SENIFSA Department",
    icon: "Users",
    description: "Software Engineering department",
    color: "orange",
  },
  maintenance: {
    name: "Maintenance Fund",
    icon: "Wallet",
    description: "System maintenance expenses",
    color: "gray",
  },
} as const;

interface ExpenseRowProps {
  expense: Expense;
  onDelete: (id: string) => void;
  canManage: boolean;
  deleting: string | null;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  onDelete,
  canManage,
  deleting,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentMethodVariant = (method: string) => {
    return method === "maintenance_balance" ? "destructive" : "default";
  };

  const getTypeVariant = (type: string) => {
    return type === "college" ? "default" : "secondary";
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div>
            <div className="font-medium">{expense.title}</div>
            <div className="text-sm text-muted-foreground">
              {expense.description}
            </div>
          </div>
        </TableCell>
        <TableCell className="font-medium">
          {formatCurrency(expense.amount)}
        </TableCell>
        <TableCell>
          <Badge variant={getTypeVariant(expense.type)}>{expense.type}</Badge>
        </TableCell>
        <TableCell>
          {expense.department ? (
            <Badge variant="outline">{expense.department}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            {ACCOUNT_CONFIG[expense.account]?.name}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant={getPaymentMethodVariant(expense.paymentMethod)}>
            {expense.paymentMethod
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
        </TableCell>
        <TableCell>{formatDate(expense.date)}</TableCell>
        <TableCell>
          <div className="text-sm">
            <div>{expense.createdBy.name}</div>
            <div className="text-muted-foreground">
              {expense.createdBy.role}
            </div>
          </div>
        </TableCell>
        <TableCell>
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the expense "{expense.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(expense._id)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting === expense._id}
            >
              {deleting === expense._id ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
