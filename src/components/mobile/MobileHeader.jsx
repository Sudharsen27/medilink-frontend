import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Bell, ChevronLeft } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { bottomNavItems, isRouteActive } from "../../config/navigation";

const routeTitles = {
  "/dashboard": "Home",
  "/appointments": "Visits",
  "/doctors": "Doctors",
  "/medical-records": "Health Records",
  "/prescriptions": "Prescriptions",
  "/telemedicine": "Telemedicine",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/emergency": "Emergency",
  "/favorites": "Favorites",
  "/patients": "Patients",
  "/caregivers": "Caregivers",
  "/patient-profile": "Patient Profile",
};

const getPageTitle = (pathname) => {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const match = Object.entries(routeTitles).find(([path]) =>
    pathname.startsWith(`${path}/`)
  );
  if (match) return match[1];
  const tab = bottomNavItems.find(
    (item) => !item.isSheet && isRouteActive(pathname, item.to, item.end)
  );
  return tab?.label || "MediLink";
};

const MobileHeader = ({ unreadCount = 0, showBack = false }) => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const isHome = location.pathname === "/dashboard";

  return (
    <header className="lg:hidden sticky top-0 z-30 mobile-header glass-panel border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-center justify-between h-14 px-4 gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 shrink-0"
              aria-label="MediLink home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center shadow-soft">
                <Activity className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
            </Link>
          )}

          <div className="min-w-0">
            {!isHome && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-health-600 dark:text-health-400 leading-none">
                MediLink
              </p>
            )}
            <h1 className={`font-display font-bold text-slate-900 dark:text-white truncate ${isHome ? "text-lg" : "text-base"}`}>
              {isHome ? "MediLink" : title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <ThemeToggle variant="icon" />
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-clinical-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
