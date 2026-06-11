import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar },
];

const AdminLayout = () => (
  <div className="min-h-screen flex flex-col lg:flex-row">
    <aside className="lg:w-64 glass-panel lg:min-h-screen border-r border-slate-200/60 dark:border-slate-700/60 p-5 shrink-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-display font-bold text-health-700 dark:text-health-400">
            Admin
          </h2>
          <p className="text-xs text-slate-500">MediLink control panel</p>
        </div>
        <Link
          to="/dashboard"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Back to app"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" aria-label="Admin navigation">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-health-600 text-white shadow-soft"
                    : "text-slate-600 dark:text-slate-400 hover:bg-health-50 dark:hover:bg-health-950/30 hover:text-health-700"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <Link
        to="/dashboard"
        className="hidden lg:flex items-center gap-2 mt-8 px-3.5 py-2.5 text-sm text-slate-500 hover:text-health-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to app
      </Link>
    </aside>

    <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </main>
  </div>
);

export default AdminLayout;
