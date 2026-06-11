import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-health-600 hover:bg-health-700 text-white shadow-soft hover:shadow-glow border border-health-600",
  secondary:
    "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
  ghost:
    "bg-transparent text-health-700 dark:text-health-400 hover:bg-health-50 dark:hover:bg-health-950/50",
  danger:
    "bg-clinical-rose hover:bg-red-600 text-white border border-clinical-rose",
  outline:
    "bg-transparent border-2 border-health-500 text-health-700 dark:text-health-400 hover:bg-health-50 dark:hover:bg-health-950/30",
  link:
    "bg-transparent text-health-600 dark:text-health-400 hover:text-health-700 dark:hover:text-health-300 underline-offset-4 hover:underline border-transparent shadow-none p-0",
};

const sizes = {
  sm: "px-3 py-2 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  className = "",
  icon: Icon,
  type = "button",
  ...props
}) => (
  <motion.button
    type={type}
    whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center font-medium
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-500 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      ${fullWidth ? "w-full" : ""}
      ${iconOnly ? "!p-2.5 aspect-square" : ""}
      ${variants[variant]} ${variant !== "link" ? sizes[size] : ""} ${className}
    `}
    {...props}
  >
    {loading ? (
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
    ) : Icon ? (
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
    ) : null}
    {children}
  </motion.button>
);

export default Button;
