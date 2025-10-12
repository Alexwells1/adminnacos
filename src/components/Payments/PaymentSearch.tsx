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
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by matric number, reference, or name..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};
