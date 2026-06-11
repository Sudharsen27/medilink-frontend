import React from "react";
import cn from "../../lib/cn";
import Card, { CardHeader } from "../Card";
import { chartSeries } from "../../design-system/tokens";

const ChartSkeleton = ({ height = "h-72" }) => (
  <div className={cn(height, "px-4 pb-4 animate-pulse")}>
    <div className="h-full rounded-xl bg-slate-100 dark:bg-slate-800/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent skeleton-shimmer" />
      <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between gap-2 h-32">
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-slate-200/80 dark:bg-slate-700/60"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Standard chart wrapper — use with Recharts inside
 */
const ChartContainer = ({
  title,
  subtitle,
  action,
  children,
  loading = false,
  height = "h-72 sm:h-80",
  className = "",
  colSpan,
  empty,
}) => (
  <Card
    className={cn("!p-0 overflow-hidden", colSpan, className)}
    padding="none"
  >
    <CardHeader
      className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2"
      title={title}
      subtitle={subtitle}
      action={action}
    />
    {loading ? (
      <ChartSkeleton height={height} />
    ) : empty ? (
      <div className={cn(height, "flex items-center justify-center px-6 pb-4 text-sm text-slate-500 dark:text-slate-400")}>
        {empty}
      </div>
    ) : (
      <div className="px-2 sm:px-4 pb-4">
        <div className={cn("w-full min-w-0", height, "min-h-[12rem]")}>
          {children}
        </div>
      </div>
    )}
  </Card>
);

export { chartSeries, ChartSkeleton };
export { default as ChartResponsive } from "./ChartResponsive";
export default ChartContainer;
