import React from "react";
import cn from "../lib/cn";

const Table = ({ children, className = "", responsive = true, ...props }) => (
  <div className={cn(responsive && "overflow-x-auto -mx-1 px-1", className)}>
    <table
      className="w-full border-collapse text-sm"
      {...props}
    >
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className = "" }) => (
  <thead className={cn("bg-slate-50 dark:bg-slate-800/80", className)}>
    {children}
  </thead>
);

const TableBody = ({ children, className = "", striped = false }) => (
  <tbody
    className={cn(
      striped && "[&>tr:nth-child(even)]:bg-slate-50/50 dark:[&>tr:nth-child(even)]:bg-slate-800/30",
      className
    )}
  >
    {children}
  </tbody>
);

const TableRow = ({ children, className = "", hover = true, ...props }) => (
  <tr
    className={cn(
      "border-t border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200",
      hover && "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className = "", align = "left", ...props }) => (
  <th
    className={cn(
      "p-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
      align === "center" && "text-center",
      align === "right" && "text-right",
      align === "left" && "text-left",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "", align = "left", ...props }) => (
  <td
    className={cn(
      "p-3",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

/** Card-wrapped table — common admin pattern */
const TableCard = ({ title, subtitle, action, children, className = "" }) => (
  <div className={cn("health-card rounded-card-lg overflow-hidden shadow-soft dark:shadow-soft-dark", className)}>
    {(title || action) && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-700/60">
        <div>
          {title && (
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCard,
};

export default Table;
