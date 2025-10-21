import { usePaymentsCache } from "@/hooks/usePaymentsCache";
import React from "react";


interface PaymentsPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: any;
  searchQuery: string;
  prefetchCache: { [key: string]: any };
  onPageChange: (page: number) => void;
}

export const PaymentsPagination: React.FC<PaymentsPaginationProps> = ({
  pagination,
  filters,
  searchQuery,
  prefetchCache,
  onPageChange,
}) => {
  const { CACHE_KEYS, getFromCache } = usePaymentsCache();

  const generateCacheKey = (page: number) => {
    return JSON.stringify({
      filters,
      page,
      limit: pagination.limit,
      searchQuery,
    });
  };

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} results
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1">
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              const cacheKey = generateCacheKey(pageNum);
              const storageCacheKey = CACHE_KEYS.PREFETCH_DATA(cacheKey);
              const isPrefetched =
                !!getFromCache(storageCacheKey) || !!prefetchCache[cacheKey];

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[2.5rem] px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md transition-colors relative ${
                    pageNum === pagination.page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } ${isPrefetched ? "ring-1 ring-green-500" : ""}`}
                  title={isPrefetched ? "Preloaded - instant navigation" : ""}
                >
                  {pageNum}
                  {isPrefetched && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>
              );
            }
          )}
        </div>

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
