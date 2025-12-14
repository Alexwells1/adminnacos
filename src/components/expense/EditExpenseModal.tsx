import { useState, useEffect } from "react";
import type { Expense } from "@/types/expense.types";

interface EditExpenseModalProps {
  open: boolean;
  expense: Expense | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (updates: {
    title?: string;
    description?: string;
    amount?: number;
  }) => void;
}

export const EditExpenseModal = ({
  open,
  expense,
  loading = false,
  onClose,
  onSubmit,
}: EditExpenseModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setDescription(expense.description || "");
      setAmount(expense.amount);
    }
  }, [expense]);

  if (!open || !expense) return null;

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      amount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Edit Expense</h2>

        {/* Title */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm border"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
