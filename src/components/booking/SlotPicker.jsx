import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Sunset, Moon } from "lucide-react";

const DEFAULT_SLOTS = {
  morning: ["09:00 AM", "10:00 AM", "11:30 AM"],
  afternoon: ["02:00 PM", "03:30 PM", "04:00 PM"],
  evening: ["06:00 PM", "07:30 PM"],
};

const PERIOD_META = {
  morning: { label: "Morning", icon: Sun, color: "amber" },
  afternoon: { label: "Afternoon", icon: Sunset, color: "orange" },
  evening: { label: "Evening", icon: Moon, color: "violet" },
};

const SlotPicker = ({ slots, selectedSlot, onSelectSlot, loading }) => {
  const grouped = useMemo(() => {
    if (slots?.length) {
      return { all: slots };
    }
    return DEFAULT_SLOTS;
  }, [slots]);

  const renderSlot = (time) => {
    const active = selectedSlot === time;
    return (
      <motion.button
        key={time}
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => onSelectSlot(time)}
        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
          active
            ? "bg-health-600 border-health-600 text-white shadow-glow"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-health-400 hover:bg-health-50 dark:hover:bg-health-950/30"
        }`}
        aria-pressed={active}
      >
        {time}
      </motion.button>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl skeleton-shimmer" />
        ))}
      </div>
    );
  }

  if (grouped.all) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {grouped.all.map(renderSlot)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([period, times]) => {
        const meta = PERIOD_META[period];
        if (!meta || !times?.length) return null;
        const Icon = meta.icon;
        return (
          <div key={period}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {meta.label}
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {times.map(renderSlot)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlotPicker;
