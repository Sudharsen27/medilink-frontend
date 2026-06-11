import React, { useId } from "react";
import cn from "../lib/cn";

const Textarea = ({
  label,
  error,
  hint,
  className = "",
  id: externalId,
  rows = 4,
  resize = "none",
  ...props
}) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const resizeClass = {
    none: "resize-none",
    vertical: "resize-y",
    both: "resize",
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={cn(
          "health-input min-h-[80px]",
          resizeClass[resize] || resizeClass.none,
          error && "border-clinical-rose focus:border-clinical-rose focus:ring-clinical-rose/20"
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined
        }
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-clinical-rose font-medium">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
