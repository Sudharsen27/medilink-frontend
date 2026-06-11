import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

/**
 * Compact native-app card for mobile lists and carousels.
 */
const MobileCard = ({
  title,
  subtitle,
  meta,
  icon: Icon,
  iconClassName = "bg-health-100 text-health-600 dark:bg-health-900/40 dark:text-health-400",
  badge,
  badgeClassName = "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
  onClick,
  trailing,
  className = "",
  compact = false,
  accent,
}) => {
  const Wrapper = onClick ? motion.button : motion.div;
  const accentBorder =
    accent === "rose"
      ? "border-rose-200/70 dark:border-rose-800/50"
      : "border-slate-200/80 dark:border-slate-700/60";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`mobile-card w-full text-left flex items-center gap-3 rounded-2xl border ${accentBorder} bg-white dark:bg-slate-900/80 shadow-soft dark:shadow-soft-dark ${
        compact ? "p-3" : "p-4"
      } ${onClick ? "active:bg-slate-50 dark:active:bg-slate-800/60 cursor-pointer" : ""} ${className}`}
    >
      {Icon && (
        <div
          className={`shrink-0 rounded-xl flex items-center justify-center ${
            compact ? "w-10 h-10" : "w-12 h-12"
          } ${iconClassName}`}
        >
          <Icon className={compact ? "w-5 h-5" : "w-5 h-5"} aria-hidden="true" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-semibold text-slate-900 dark:text-white truncate ${compact ? "text-sm" : "text-base"}`}>
            {title}
          </p>
          {badge && (
            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${badgeClassName}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={`text-slate-500 dark:text-slate-400 truncate mt-0.5 ${compact ? "text-xs" : "text-sm"}`}>
            {subtitle}
          </p>
        )}
        {meta && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{meta}</p>
        )}
      </div>

      {trailing || (onClick && (
        <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
      ))}
    </Wrapper>
  );
};

/** Horizontal snap-scroll row for mobile carousels */
export const MobileCardScroller = ({ children, className = "" }) => (
  <div
    className={`flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory scrollbar-none ${className}`}
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {React.Children.map(children, (child) => (
      <div className="snap-start shrink-0 w-[min(88vw,20rem)]">{child}</div>
    ))}
  </div>
);

export default MobileCard;
