import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const colorMap = {
  blue: {
    bg: "from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20",
    border: "border-blue-200/80 dark:border-blue-800/50",
    text: "text-blue-700 dark:text-blue-300",
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "from-health-50 to-health-100/50 dark:from-health-950/40 dark:to-health-900/20",
    border: "border-health-200/80 dark:border-health-800/50",
    text: "text-health-700 dark:text-health-300",
    icon: "bg-health-500/10 text-health-600 dark:text-health-400",
  },
  yellow: {
    bg: "from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20",
    border: "border-amber-200/80 dark:border-amber-800/50",
    text: "text-amber-700 dark:text-amber-300",
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  orange: {
    bg: "from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20",
    border: "border-orange-200/80 dark:border-orange-800/50",
    text: "text-orange-700 dark:text-orange-300",
    icon: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  purple: {
    bg: "from-violet-50 to-violet-100/50 dark:from-violet-950/40 dark:to-violet-900/20",
    border: "border-violet-200/80 dark:border-violet-800/50",
    text: "text-violet-700 dark:text-violet-300",
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  red: {
    bg: "from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/20",
    border: "border-rose-200/80 dark:border-rose-800/50",
    text: "text-rose-700 dark:text-rose-300",
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
};

const StatsCard = ({ title, value, icon: Icon, trend, color = "blue", onClick }) => {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full text-left p-5 rounded-card-lg border bg-gradient-to-br
        ${styles.bg} ${styles.border}
        shadow-soft hover:shadow-glow transition-shadow duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-500
      `}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 tabular-nums ${styles.text}`}>
            {value}
          </p>
          {trend !== undefined && (
            <p
              className={`flex items-center gap-1 text-xs mt-2 font-medium ${
                trend > 0 ? "text-health-600" : "text-clinical-rose"
              }`}
            >
              {trend > 0 ? (
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {Math.abs(trend)}% vs last week
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default StatsCard;
