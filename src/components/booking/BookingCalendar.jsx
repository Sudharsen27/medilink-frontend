import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const BookingCalendar = ({ selectedDate, onSelectDate }) => {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(
    () => selectedDate || new Date()
  );

  const { year, month, days, monthLabel } = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const total = last.getDate();

    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(y, m, d));

    return {
      year: y,
      month: m,
      days: cells,
      monthLabel: viewDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [viewDate]);

  const prevMonth = () =>
    setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {monthLabel}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-slate-400 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const disabled = startOfDay(day) < today;
          const selected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <motion.button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              whileTap={disabled ? {} : { scale: 0.92 }}
              onClick={() => onSelectDate(day)}
              className={`
                aspect-square rounded-xl text-sm font-medium transition-all
                ${disabled ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : "hover:bg-health-50 dark:hover:bg-health-950/30 cursor-pointer"}
                ${selected ? "bg-health-600 text-white shadow-soft hover:bg-health-600" : ""}
                ${isToday && !selected ? "ring-2 ring-health-400 ring-inset text-health-700 dark:text-health-400" : ""}
                ${!selected && !disabled ? "text-slate-700 dark:text-slate-300" : ""}
              `}
              aria-label={day.toLocaleDateString()}
              aria-pressed={selected}
            >
              {day.getDate()}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
