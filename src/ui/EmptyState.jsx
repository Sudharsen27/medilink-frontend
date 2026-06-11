import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
    className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-health-50 dark:bg-health-950/40 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-health-600 dark:text-health-400" aria-hidden="true" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
    )}
    {actionLabel && onAction && (
      <Button onClick={onAction} size="md">
        {actionLabel}
      </Button>
    )}
  </motion.div>
);

export default EmptyState;
