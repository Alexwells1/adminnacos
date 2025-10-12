// src/components/Payments/PaymentSearch.tsx
import React, { useState } from "react";

interface PaymentSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const PaymentSearch: React.FC<PaymentSearchProps> = ({
  onSearch,
  loading = false,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by matric number, reference, or name..."
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
