import React, { useCallback, useMemo, useState } from "react";
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

interface ExpenseRowProps {
  expense: Expense;
  onDelete: (id: string) => void;
  canManage: boolean;
  deleting: string | null;
}

const ExpenseRowComponent: React.FC<ExpenseRowProps> = ({
  expense,
  onDelete,
  canManage,
  deleting,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formattedAmount = useMemo(
    () => `₦${expense.amount.toLocaleString()}`,
    [expense.amount]
  );

  const formattedDate = useMemo(
    () =>
      new Date(expense.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [expense.date]
  );

  const typeVariant = useMemo(
    () => (expense.type === "college" ? "default" : "secondary"),
    [expense.type]
  );

  const handleConfirmDelete = useCallback(() => {
    onDelete(expense._id);
  }, [expense._id, onDelete]);

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="max-w-[250px] truncate">
            <div className="font-medium truncate">{expense.title}</div>
            <div className="text-sm text-muted-foreground truncate">
              {expense.description}
            </div>
          </div>
        </TableCell>

        <TableCell className="font-medium">{formattedAmount}</TableCell>

        <TableCell>
          <Badge variant={typeVariant}>{expense.type}</Badge>
        </TableCell>

        <TableCell>
          {expense.department ? (
            <Badge variant="outline">{expense.department}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>

        <TableCell>{formattedDate}</TableCell>

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

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{expense.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
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

export const ExpenseRow = React.memo(ExpenseRowComponent);
ExpenseRow.displayName = "ExpenseRow";
