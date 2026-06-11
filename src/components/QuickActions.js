import React from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  RefreshCw,
  Printer,
  Bell,
} from "lucide-react";
import Card, { CardHeader } from "../ui/Card";

const actions = [
  {
    id: "new-appointment",
    label: "New Appointment",
    description: "Schedule a visit",
    icon: CalendarPlus,
    color: "health",
  },
  {
    id: "refresh",
    label: "Refresh Data",
    description: "Sync latest info",
    icon: RefreshCw,
    color: "blue",
  },
  {
    id: "print",
    label: "Print Report",
    description: "Export summary",
    icon: Printer,
    color: "violet",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "View alerts",
    icon: Bell,
    color: "amber",
    badge: true,
  },
];

const iconColors = {
  health: "bg-health-100 text-health-700 dark:bg-health-900/40 dark:text-health-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

const QuickActions = ({ onAction, unreadNotifications = 0 }) => (
  <Card padding="md">
    <CardHeader
      title="Quick Actions"
      subtitle="Common tasks at your fingertips"
    />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const badgeCount = action.badge ? unreadNotifications : 0;

        return (
          <motion.button
            key={action.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.id)}
            className="relative flex flex-col items-center gap-2 p-4 rounded-card border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-soft transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-500"
          >
            <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center ${iconColors[action.color]}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
              {badgeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-clinical-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badgeCount}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-center">
              {action.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">
              {action.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  </Card>
);

export default QuickActions;
