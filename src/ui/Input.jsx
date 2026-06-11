import React, { useId } from "react";

const Input = ({
  label,
  error,
  hint,
  icon: Icon,
  rightElement,
  className = "",
  id: externalId,
  ...props
}) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          className={`health-input ${Icon ? "pl-11" : ""} ${rightElement ? "pr-12" : ""} ${
            error ? "border-clinical-rose focus:border-clinical-rose focus:ring-clinical-rose/20" : ""
          }`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined
          }
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-clinical-rose font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
