import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CalendarPlus, Video, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { id: "book", label: "Book visit", icon: CalendarPlus, to: "/doctors", color: "bg-health-600" },
  { id: "telemedicine", label: "Video consult", icon: Video, to: "/telemedicine", color: "bg-violet-600" },
  { id: "records", label: "Add record", icon: FileText, to: "/medical-records", color: "bg-blue-600" },
];

const FloatingActionButton = ({ hidden = false }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (hidden) return null;

  const handleAction = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[45] bg-slate-900/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close quick actions"
          />
        )}
      </AnimatePresence>

      <div className="lg:hidden fixed z-50 mobile-fab-container" aria-label="Quick actions">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute bottom-[calc(100%+0.75rem)] right-0 flex flex-col gap-2 items-end"
            >
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    type="button"
                    initial={{ opacity: 0, x: 16, y: 8 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleAction(action.to)}
                    className="flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-full glass-panel shadow-glass-lg text-sm font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap"
                  >
                    {action.label}
                    <span className={`w-9 h-9 rounded-full ${action.color} text-white flex items-center justify-center shadow-soft`}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => setOpen((v) => !v)}
          className={`mobile-fab w-14 h-14 rounded-full flex items-center justify-center shadow-glow dark:shadow-glow-dark text-white transition-colors ${
            open ? "bg-slate-700 dark:bg-slate-600" : "bg-gradient-to-br from-health-500 to-health-700"
          }`}
          aria-label={open ? "Close quick actions" : "Quick actions"}
          aria-expanded={open}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" strokeWidth={2.5} />}
          </motion.span>
        </motion.button>
      </div>
    </>
  );
};

export default FloatingActionButton;
