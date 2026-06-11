import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, LogOut } from "lucide-react";
import { moreSheetSections, isRouteActive } from "../../config/navigation";
import ThemeToggle from "../ThemeToggle";

const MoreSheet = ({
  open,
  onClose,
  user,
  onLogout,
  favoritesCount = 0,
  unreadCount = 0,
}) => {
  const location = useLocation();
  const badges = { favorites: favoritesCount, notifications: unreadCount };
  const sections = moreSheetSections(user);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[55] bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="More options"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) onClose();
            }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-[56] max-h-[min(88vh,640px)] rounded-t-3xl glass-panel border-t border-slate-200/70 dark:border-slate-700/60 shadow-glass-lg-dark flex flex-col mobile-sheet-safe-bottom"
          >
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
            </div>

            <div className="flex items-center justify-between px-5 pb-3 shrink-0">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                  More
                </h2>
                {user && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {user.name} · {user.role}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 space-y-5">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-2">
                    {section.title}
                  </p>
                  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isRouteActive(location.pathname, item.to);
                      const badge = item.badgeKey ? badges[item.badgeKey] : 0;

                      return (
                        <NavLink
                          key={`${section.title}-${item.label}`}
                          to={item.to}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-slate-50 dark:active:bg-slate-800/60 ${
                            active ? "bg-health-50/80 dark:bg-health-950/30" : ""
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              item.accent === "rose"
                                ? "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                                : item.accent === "health"
                                  ? "bg-health-100 text-health-600 dark:bg-health-900/40 dark:text-health-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {item.label}
                              </p>
                              {badge > 0 && (
                                <span className="min-w-[18px] h-[18px] px-1 bg-clinical-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                  {badge > 99 ? "99+" : badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 p-3 space-y-1">
                <ThemeToggle variant="menu" placement="top" />
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-clinical-rose hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-colors"
                >
                  <LogOut className="w-[18px] h-[18px]" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoreSheet;
