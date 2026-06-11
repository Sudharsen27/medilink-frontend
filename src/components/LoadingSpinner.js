import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "md", text = "Loading...", message }) => {
  const displayText = message || text;
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className="flex flex-col justify-center items-center p-6 space-y-3"
      role="status"
      aria-live="polite"
      aria-label={displayText}
    >
      <Loader2
        className={`${sizes[size]} text-health-600 animate-spin`}
        aria-hidden="true"
      />
      {displayText && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {displayText}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
