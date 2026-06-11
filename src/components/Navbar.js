import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Video,
  User,
  Heart,
  Users,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Activity,
  Shield,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import NotificationsBell from "./NotificationsBell";
import { useFavorites } from "../context/FavoritesContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/telemedicine", label: "Telemedicine", icon: Video },
  { to: "/profile", label: "Profile", icon: User },
];

const userMenuLinks = [
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/patient-profile", label: "Patient Profile", icon: UserCircle },
  { to: "/patients", label: "Patient Management", icon: Users },
  { to: "/caregivers", label: "Caregiver Mode", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
];

const NavLink = ({ to, label, icon: Icon, isActive, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? "bg-white/20 text-white shadow-soft"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
    <span>{label}</span>
    {badge > 0 && (
      <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-clinical-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
  const location = useLocation();
  const { getFavoriteCount } = useFavorites();
  const favoritesCount = getFavoriteCount();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const UserAvatar = ({ size = "md" }) => {
    const sizes = { md: "w-9 h-9", lg: "w-14 h-14 text-xl" };
    return (
      <div className={`${sizes[size]} rounded-xl overflow-hidden shadow-soft bg-white/20 shrink-0`}>
        {user.photo ? (
          <img src={user.photo} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-health-400 to-health-600 text-white font-bold text-sm">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-nav shadow-glass-lg" : "bg-health-700/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-soft"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center gap-3 group"
              aria-label="MediLink home"
            >
              <div className="relative w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-health-600" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold text-white tracking-tight">
                  MediLink
                </h1>
                <p className="text-[10px] text-white/70 -mt-0.5 tracking-wide uppercase">
                  Healthcare Platform
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <NavLink key={link.to} {...link} isActive={isActive(link.to)} />
              ))}
              <NavLink
                to="/favorites"
                label="Favorites"
                icon={Heart}
                isActive={isActive("/favorites")}
                badge={favoritesCount}
              />
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <NotificationsBell />
              </div>
              <div className="hidden md:block">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              </div>

              {user && (
                <div className="hidden lg:block relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-xl transition-all border border-white/15"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <UserAvatar />
                    <span className="text-white text-sm font-medium max-w-[100px] truncate hidden xl:block">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white/70" aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                          aria-hidden="true"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-60 glass-panel rounded-card-lg py-2 z-50 overflow-hidden"
                          role="menu"
                        >
                          <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          {userMenuLinks.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              role="menuitem"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-health-50 dark:hover:bg-health-950/30 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <link.icon className="w-4 h-4 text-health-600" aria-hidden="true" />
                              {link.label}
                            </Link>
                          ))}
                          {user.role === "admin" && (
                            <Link
                              to="/admin"
                              role="menuitem"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-health-50 dark:hover:bg-health-950/30"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield className="w-4 h-4 text-health-600" aria-hidden="true" />
                              Admin Panel
                            </Link>
                          )}
                          <div className="border-t border-slate-200/60 dark:border-slate-700/60 mt-1 pt-1">
                            <button
                              type="button"
                              role="menuitem"
                              onClick={onLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-clinical-rose hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              <LogOut className="w-4 h-4" aria-hidden="true" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button
                type="button"
                className="lg:hidden p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 top-16"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="lg:hidden fixed top-16 right-0 bottom-0 w-[min(320px,88vw)] bg-health-800 dark:bg-slate-900 shadow-glass-lg z-50 overflow-y-auto"
                aria-label="Mobile navigation"
              >
                <div className="p-5 space-y-6">
                  {user && (
                    <div className="flex items-center gap-3 p-4 rounded-card-lg bg-white/10 border border-white/15">
                      <UserAvatar size="lg" />
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{user.name}</p>
                        <p className="text-health-200 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <nav className="space-y-1">
                    {[...navLinks, { to: "/favorites", label: "Favorites", icon: Heart }].map(
                      (link) => (
                        <NavLink
                          key={link.to}
                          {...link}
                          isActive={isActive(link.to)}
                          onClick={() => setIsMenuOpen(false)}
                          badge={link.to === "/favorites" ? favoritesCount : 0}
                        />
                      )
                    )}
                  </nav>

                  <div className="flex items-center justify-between p-4 rounded-card-lg bg-white/10">
                    <span className="text-white text-sm font-medium">Notifications</span>
                    <NotificationsBell />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-card-lg bg-white/10">
                    <span className="text-white text-sm font-medium">Dark mode</span>
                    <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                  </div>

                  {user && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-clinical-rose hover:bg-red-600 text-white font-semibold rounded-card-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>

      <div className="h-16 lg:h-[4.5rem]" aria-hidden="true" />
    </>
  );
};

export default Navbar;
