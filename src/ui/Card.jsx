import React from "react";
import { motion } from "framer-motion";

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = ({
  children,
  className = "",
  padding = "md",
  glass = false,
  hover = false,
  animate = false,
  ...props
}) => {
  const base = glass
    ? "glass-panel rounded-card-lg"
    : "health-card rounded-card-lg";

  const hoverClass = hover
    ? "transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer"
    : "";

  const Wrapper = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      className={`${base} ${paddings[padding]} ${hoverClass} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

export const CardHeader = ({ title, subtitle, action, className = "" }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${className}`}>
    <div>
      {title && (
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default Card;
