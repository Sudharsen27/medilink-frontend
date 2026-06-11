import React from "react";
import { NavLink } from "react-router-dom";
import cn from "../../lib/cn";
import Badge from "../Badge";

/**
 * Sidebar navigation link — desktop rail
 */
export const SideNavLink = ({
  to,
  icon: Icon,
  label,
  badge,
  collapsed = false,
  end = false,
  onClick,
}) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-health-50 dark:bg-health-950/40 text-health-700 dark:text-health-400 shadow-sm"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
      )
    }
  >
    {Icon && (
      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
    )}
    {!collapsed && (
      <>
        <span className="flex-1 truncate">{label}</span>
        {badge != null && badge > 0 && (
          <Badge variant="brand" size="sm">{badge > 99 ? "99+" : badge}</Badge>
        )}
      </>
    )}
  </NavLink>
);

/**
 * Bottom navigation tab — mobile chrome
 */
export const BottomNavTab = ({
  to,
  icon: Icon,
  label,
  isActive,
  layoutId,
  onClick,
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={cn(
      "relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1",
      "text-[10px] font-semibold transition-colors",
      isActive
        ? "text-health-700 dark:text-health-400"
        : "text-slate-500 dark:text-slate-400"
    )}
  >
    {isActive && layoutId && (
      <span
        className="absolute inset-x-2 -top-0.5 h-8 rounded-xl bg-health-100/80 dark:bg-health-950/50"
        style={{ zIndex: 0 }}
      />
    )}
    <span className="relative z-10 flex flex-col items-center gap-0.5">
      {Icon && <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 2} aria-hidden="true" />}
      <span className="leading-none tracking-tight truncate max-w-[4.5rem]">{label}</span>
    </span>
  </NavLink>
);

/**
 * Section label for nav groups
 */
export const NavSection = ({ title, collapsed = false, className = "" }) => {
  if (collapsed) return <div className="h-2" aria-hidden="true" />;
  return (
    <p
      className={cn(
        "px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500",
        className
      )}
    >
      {title}
    </p>
  );
};

/**
 * Sheet nav row — mobile more menu
 */
export const SheetNavRow = ({
  to,
  icon: Icon,
  label,
  description,
  badge,
  onClick,
  external = false,
}) => {
  const className =
    "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60";

  const content = (
    <>
      {Icon && (
        <span className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
        {description && (
          <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">{description}</span>
        )}
      </span>
      {badge != null && badge > 0 && (
        <Badge variant="brand" size="sm">{badge > 99 ? "99+" : badge}</Badge>
      )}
    </>
  );

  if (external) {
    return (
      <a href={to} className={className} onClick={onClick} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <NavLink to={to} className={className} onClick={onClick}>
      {content}
    </NavLink>
  );
};

export default SideNavLink;
