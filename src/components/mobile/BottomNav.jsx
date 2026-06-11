import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { bottomNavItems, isRouteActive } from "../../config/navigation";

const BottomNav = ({ onMorePress, favoritesCount = 0, unreadCount = 0 }) => {
  const location = useLocation();

  const badges = { favorites: favoritesCount, notifications: unreadCount };

  const isTabActive = (item) => {
    if (item.isSheet) {
      return false;
    }
    return isRouteActive(location.pathname, item.to, item.end);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 mobile-bottom-nav"
      aria-label="Primary navigation"
    >
      <div className="mobile-bottom-nav-inner glass-panel border-t border-slate-200/70 dark:border-slate-700/60">
        <ul className="flex items-stretch justify-around h-[var(--bottom-nav-height)]">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isTabActive(item);

            if (item.isSheet) {
              return (
                <li key={item.id} className="flex-1 max-w-[5.5rem]">
                  <button
                    type="button"
                    onClick={onMorePress}
                    className="mobile-nav-item w-full h-full"
                    aria-label="More options"
                  >
                    <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.25 : 2} aria-hidden="true" />
                    <span className="mobile-nav-label">{item.label}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={item.id} className="flex-1 max-w-[5.5rem]">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={() =>
                    `mobile-nav-item w-full h-full relative ${active ? "mobile-nav-item-active" : ""}`
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="bottom-nav-pill"
                      className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-health-500"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative">
                    <Icon
                      className={`w-[22px] h-[22px] transition-colors ${
                        active ? "text-health-600 dark:text-health-400" : ""
                      }`}
                      strokeWidth={active ? 2.25 : 2}
                      aria-hidden="true"
                    />
                    {item.badgeKey && badges[item.badgeKey] > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 bg-clinical-rose text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {badges[item.badgeKey] > 9 ? "9+" : badges[item.badgeKey]}
                      </span>
                    )}
                  </span>
                  <span className={`mobile-nav-label ${active ? "text-health-700 dark:text-health-400" : ""}`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
