import React from "react";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = "",
}) => {
  if (progress <= 0 || progress >= 100) return null;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
