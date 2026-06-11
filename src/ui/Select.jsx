import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import cn from "../lib/cn";

const Select = ({
  label,
  error,
  hint,
  options = [],
  placeholder,
  className = "",
  id: externalId,
  children,
  ...props
}) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            "health-input appearance-none pr-10 cursor-pointer",
            error && "border-clinical-rose focus:border-clinical-rose focus:ring-clinical-rose/20"
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-clinical-rose font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;
