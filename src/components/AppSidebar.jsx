import React, { useMemo, useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
  MoreHorizontal,
} from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useEnhancedNotifications } from "../context/EnhancedNotificationsContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import {
  mainNavItems,
  healthNavItems,
  accountNavItems,
  moreNavItems,
  isRouteActive,
} from "../config/navigation";

const EXPANDED_WIDTH = 272;
const COLLAPSED_WIDTH = 80;

const SidebarTooltip = ({ label, children, show }) => {
  if (!show) return children;

  return (
    <div className="relative group/tip w-full flex justify-center">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 z-[60] whitespace-nowrap rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium px-2.5 py-1.5 opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100 transition-all duration-150 shadow-lg"
      >
        {label}
      </span>
    </div>
  );
};

const Badge = ({ count, collapsed }) => {
  if (!count || count <= 0) return null;
  const label = count > 99 ? "99+" : count;

  if (collapsed) {
    return (
      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-clinical-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
        {label}
      </span>
    );
  }

  return (
    <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-clinical-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
      {label}
    </span>
  );
};

const SidebarNavItem = ({
  to,
  label,
  icon: Icon,
  end,
  collapsed,
  badge,
  onNavigate,
  animateActive = true,
}) => {
  const location = useLocation();
  const active = isRouteActive(location.pathname, to, end);

  const link = (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) => {
        const highlighted = isActive || active;
        return `relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
          collapsed
            ? "w-11 h-11 justify-center mx-auto"
            : "gap-3 px-3 py-2.5 w-full"
        } ${
          highlighted
            ? "text-health-700 dark:text-health-300"
            : "text-slate-500 dark:text-slate-400 hover:text-health-700 dark:hover:text-health-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
        }`;
      }}
    >
      {({ isActive }) => {
        const highlighted = isActive || active;
        return (
          <>
            {highlighted && (
              <motion.span
                layoutId={animateActive ? "sidebar-active-pill" : undefined}
                className={`absolute inset-0 rounded-xl bg-health-50 dark:bg-health-950/50 ${
                  collapsed ? "" : "border border-health-200/50 dark:border-health-800/40"
                }`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {highlighted && collapsed && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-health-500" />
            )}
            <span className="relative z-10 shrink-0">
              <Icon
                className={`w-5 h-5 ${
                  highlighted ? "text-health-600 dark:text-health-400" : ""
                }`}
                strokeWidth={highlighted ? 2.25 : 2}
                aria-hidden="true"
              />
            </span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="relative z-10 truncate flex-1"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && (
              <span className="relative z-10">
                <Badge count={badge} collapsed={false} />
              </span>
            )}
            {collapsed && <Badge count={badge} collapsed />}
          </>
        );
      }}
    </NavLink>
  );

  return (
    <SidebarTooltip label={label} show={collapsed}>
      {link}
    </SidebarTooltip>
  );
};

const NavSection = ({ title, collapsed, children, showDivider }) => (
  <div className={collapsed ? "" : "mb-4 last:mb-0"}>
    {showDivider && collapsed && (
      <div className="mx-auto my-2 w-8 border-t border-slate-200/80 dark:border-slate-700/60" />
    )}
    {!collapsed && title && (
      <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {title}
      </p>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

const MoreMenu = ({ collapsed, items, onNavigate, user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  const adminItem =
    user?.role === "admin"
      ? [{ to: "/admin", label: "Admin Panel", icon: Shield }]
      : [];
  const allItems = [...items, ...adminItem];

  const isMoreActive = allItems.some((item) =>
    isRouteActive(location.pathname, item.to, item.end)
  );

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
        collapsed
          ? "w-11 h-11 justify-center mx-auto"
          : "gap-3 px-3 py-2.5 w-full"
      } ${
        isMoreActive || open
          ? "text-health-700 dark:text-health-300 bg-health-50 dark:bg-health-950/50"
          : "text-slate-500 dark:text-slate-400 hover:text-health-700 dark:hover:text-health-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
      }`}
      aria-label="More navigation"
      aria-expanded={open}
    >
      <MoreHorizontal className="w-5 h-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">More</span>
          <ChevronRight
            className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </>
      )}
    </button>
  );

  return (
    <div
      className={`relative ${collapsed ? "w-full flex justify-center" : "w-full"}`}
      ref={ref}
    >
      <SidebarTooltip label="More" show={collapsed}>
        {trigger}
      </SidebarTooltip>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: collapsed ? 0 : -4, x: collapsed ? -8 : 0, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: collapsed ? 0 : -4, x: collapsed ? -8 : 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-[60] rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 shadow-glass-lg py-1.5 overflow-hidden ${
              collapsed
                ? "left-[calc(100%+0.5rem)] bottom-0 w-52"
                : "left-2 right-2 top-[calc(100%+0.25rem)]"
            }`}
          >
            {allItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(location.pathname, item.to, item.end);
              return (
                <NavLink
                  key={`${item.to}-${item.label}`}
                  to={item.to}
                  onClick={() => {
                    onNavigate?.();
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "text-health-700 dark:text-health-300 bg-health-50 dark:bg-health-950/40"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarFooter = ({ user, collapsed, onLogout, onNavigate }) => {
  const { theme } = useTheme();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <SidebarTooltip label={`Theme: ${theme}`} show>
          <ThemeToggle variant="sidebar-collapsed" />
        </SidebarTooltip>

        {user && (
          <SidebarTooltip label={user.name} show>
            <NavLink
              to="/profile"
              onClick={onNavigate}
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <UserAvatar user={user} size="sm" />
            </NavLink>
          </SidebarTooltip>
        )}

        <SidebarTooltip label="Logout" show>
          <button
            type="button"
            onClick={onLogout}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-clinical-rose hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </SidebarTooltip>
      </div>
    );
  }

  return (
    <div className="relative overflow-visible rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-gradient-to-br from-slate-50/90 to-white dark:from-slate-800/50 dark:to-slate-900/80 p-3 shadow-soft">
      {user && (
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 mb-3 group"
        >
          <UserAvatar user={user} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-health-700 dark:group-hover:text-health-400 transition-colors">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
              {user.role}
            </p>
          </div>
        </NavLink>
      )}

      <ThemeToggle variant="menu" className="mb-2" placement="top" />

      <div className="h-px bg-slate-200/80 dark:bg-slate-700/60 mb-2" />

      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-clinical-rose hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-colors"
      >
        <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
};

const UserAvatar = ({ user, size = "md" }) => {
  const sizes = { sm: "w-9 h-9 text-xs", md: "w-10 h-10 text-sm" };
  return (
    <div className={`${sizes[size]} rounded-xl overflow-hidden shrink-0`}>
      {user?.photo ? (
        <img src={user.photo} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-health-400 to-health-600 text-white font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};

const SidebarContent = ({
  user,
  collapsed,
  onToggleCollapse,
  onLogout,
  onNavigate,
  showCloseButton,
  onClose,
  favoritesCount,
  unreadCount,
  animateActive = true,
}) => (
  <div className="relative flex h-full flex-col bg-[var(--surface-elevated)] transition-colors duration-theme">
    {collapsed && onToggleCollapse && !showCloseButton && (
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-[4.5rem] z-50 w-6 h-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-health-600 shadow-soft transition-colors"
        aria-label="Expand sidebar"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    )}

    {/* Brand */}
    <div
      className={`flex items-center shrink-0 h-[4.25rem] border-b border-slate-200/70 dark:border-slate-700/60 ${
        collapsed ? "justify-center px-2" : "justify-between px-4"
      }`}
    >
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        className={`flex items-center min-w-0 group ${collapsed ? "" : "gap-3"}`}
        aria-label="MediLink home"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform shrink-0">
          <Activity className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="min-w-0"
            >
              <p className="font-display font-bold text-slate-900 dark:text-white leading-tight">
                MediLink
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Healthcare
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>

      {showCloseButton ? (
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      ) : (
        !collapsed &&
        onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg text-slate-400 hover:text-health-600 hover:bg-health-50 dark:hover:bg-health-950/40 transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )
      )}
    </div>

    {/* Navigation */}
    <nav
      className={`flex-1 min-h-0 px-3 py-4 overflow-y-auto overflow-x-hidden ${
        collapsed ? "sidebar-scroll-hidden" : "sidebar-scroll-hover"
      }`}
      aria-label="Main navigation"
    >
      <NavSection title="Main" collapsed={collapsed}>
        {mainNavItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            {...item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            animateActive={animateActive}
          />
        ))}
      </NavSection>

      <NavSection title="Health" collapsed={collapsed} showDivider>
        {healthNavItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            {...item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            badge={item.badgeKey === "favorites" ? favoritesCount : 0}
            animateActive={animateActive}
          />
        ))}
      </NavSection>

      <NavSection title="Account" collapsed={collapsed} showDivider>
        {accountNavItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            {...item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            badge={item.badgeKey === "notifications" ? unreadCount : 0}
            animateActive={animateActive}
          />
        ))}
        <MoreMenu
          collapsed={collapsed}
          items={moreNavItems}
          onNavigate={onNavigate}
          user={user}
        />
      </NavSection>
    </nav>

    {/* Footer */}
    <div className="relative shrink-0 overflow-visible border-t border-slate-200/70 dark:border-slate-700/60 p-3 bg-white/50 dark:bg-slate-900/50">
      <SidebarFooter
        user={user}
        collapsed={collapsed}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />
    </div>
  </div>
);

const AppSidebar = ({
  user,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const { getFavoriteCount } = useFavorites();
  const { unreadCount } = useEnhancedNotifications();
  const favoritesCount = getFavoriteCount();
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const sharedProps = useMemo(
    () => ({
      user,
      collapsed,
      onToggleCollapse,
      onLogout,
      favoritesCount,
      unreadCount,
    }),
    [user, collapsed, favoritesCount, unreadCount, onToggleCollapse, onLogout]
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 400, damping: 38 }}
      style={{ width: sidebarWidth }}
      className="hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-slate-200/60 dark:border-slate-700/60 shadow-soft overflow-visible"
      aria-label="Application sidebar"
    >
      <SidebarContent {...sharedProps} onNavigate={undefined} />
    </motion.aside>
  );
};

export { EXPANDED_WIDTH, COLLAPSED_WIDTH };
export default AppSidebar;
