import React from "react";

interface CacheStatusProps {
  status: "fresh" | "stale" | "none";
}

export const CacheStatus: React.FC<CacheStatusProps> = ({ status }) => {
  if (status === "none") return null;

  const config = {
    fresh: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "📦 Cached",
    },
    stale: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "🔄 Stale",
    },
  }[status];

  return (
    <div
      className={`text-xs ${config.bg} ${config.text} px-3 py-1 rounded-full border ${config.border}`}
    >
      {config.label}
    </div>
  );
};
