import React, { useId } from "react";
import cn from "../lib/cn";
import { Label } from "./Typography";

/**
 * Shared form field wrapper — label, control slot, hint, error
 */
const FormField = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  className = "",
  children,
}) => {
  const generatedId = useId();
  const id = htmlFor || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {typeof children === "function"
        ? children({ id, errorId, hintId, "aria-invalid": error ? "true" : undefined })
        : children}
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

export default FormField;
