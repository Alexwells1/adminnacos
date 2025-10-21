import React from "react";
import { RefreshCw } from "lucide-react";

interface PrefetchIndicatorProps {
  prefetchLoading: Set<number>;
}

export const PrefetchIndicator: React.FC<PrefetchIndicatorProps> = ({
  prefetchLoading,
}) => {
  if (prefetchLoading.size === 0) return null;

  return (
    <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 inline-flex items-center gap-2">
      <RefreshCw className="h-3 w-3 animate-spin" />
      Preloading pages: {Array.from(prefetchLoading).join(", ")}
    </div>
  );
};
