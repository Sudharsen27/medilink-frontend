import React from "react";

const ChartTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  showTotal = false,
}) => {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter ? labelFormatter(label) : label;
  const total = showTotal
    ? payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
    : null;

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-glass-lg text-xs min-w-[8rem]">
      {displayLabel && (
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
          {displayLabel}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
              {valueFormatter ? valueFormatter(entry.value, entry) : entry.value}
            </span>
          </div>
        ))}
      </div>
      {showTotal && total !== null && (
        <p className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200 flex justify-between">
          <span>Total</span>
          <span className="tabular-nums">
            {valueFormatter ? valueFormatter(total) : total}
          </span>
        </p>
      )}
    </div>
  );
};

export default ChartTooltip;
