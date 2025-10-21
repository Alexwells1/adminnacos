import React from "react";

interface ProgressBarProps {
  progress: number;
  loading: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  loading,
}) => {
  if (!loading || progress <= 0) return null;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Loading payments...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
