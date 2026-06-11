import React from "react";
import cn from "../lib/cn";

/**
 * Filter / tag chip — used for category filters, quick actions
 */
const Chip = ({
  children,
  selected = false,
  onClick,
  icon: Icon,
  count,
  className = "",
  ...props
}) => {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0",
        selected
          ? "bg-health-600 text-white shadow-soft"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:opacity-90",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
      {children}
      {count != null && (
        <span className={cn("tabular-nums", selected ? "text-health-100" : "opacity-70")}>
          {count}
        </span>
      )}
    </Component>
  );
};

export default Chip;
