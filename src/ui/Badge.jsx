import React from "react";
import cn from "../lib/cn";

const variants = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  brand: "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
  success: "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  violet: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  outline: "bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400",
};

const sizes = {
  sm: "text-[10px] px-1.5 py-0.5 rounded-md",
  md: "text-xs px-2 py-0.5 rounded-full",
  lg: "text-sm px-2.5 py-1 rounded-full",
};

/** Appointment / clinical status presets */
export const statusVariants = {
  scheduled: "info",
  confirmed: "success",
  completed: "default",
  cancelled: "danger",
  pending: "warning",
  active: "success",
  inactive: "default",
};

const Badge = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 font-semibold whitespace-nowrap",
      variants[variant] || variants.default,
      sizes[size],
      className
    )}
    {...props}
  >
    {dot && (
      <span
        className="w-1.5 h-1.5 rounded-full bg-current opacity-80"
        aria-hidden="true"
      />
    )}
    {children}
  </span>
);

export const StatusBadge = ({ status, className = "" }) => {
  const variant = statusVariants[status?.toLowerCase()] || "default";
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
    : "Unknown";

  return (
    <Badge variant={variant} dot size="md" className={className}>
      {label}
    </Badge>
  );
};

export default Badge;
