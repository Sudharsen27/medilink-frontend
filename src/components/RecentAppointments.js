import React from "react";
import { Calendar, ChevronRight } from "lucide-react";
import Avatar from "./Avatar";
import Card, { CardHeader } from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

const getStatusStyles = (status) => {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-full capitalize";
  const map = {
    confirmed: `${base} bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300`,
    pending: `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300`,
    cancelled: `${base} bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300`,
    completed: `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300`,
  };
  return map[status] || `${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`;
};

const formatDateTime = (dateString, timeString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: timeString || "No time specified",
  };
};

const RecentAppointments = ({ appointments, onViewAll }) => {
  const recentAppointments = appointments.slice(0, 5);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-6 pt-6">
        <CardHeader
          title="Recent Appointments"
          subtitle="Your most recent scheduled visits"
          action={
            <Button variant="ghost" size="sm" onClick={onViewAll} icon={ChevronRight}>
              View all
            </Button>
          }
        />
      </div>

      <div className="px-6 pb-6 space-y-3">
        {recentAppointments.length > 0 ? (
          recentAppointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.date, appointment.time);
            return (
              <div
                key={appointment.id}
                className="flex items-center justify-between gap-4 p-4 rounded-card bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-soft transition-all duration-200"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar
                    name={appointment.userName || appointment.title || "User"}
                    src={appointment.avatar}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {appointment.title || "Appointment"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {appointment.userName || "No name provided"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {date} · {time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={getStatusStyles(appointment.status)}>
                    {appointment.status || "pending"}
                  </span>
                  {appointment.urgent && (
                    <span className="px-2 py-1 text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={Calendar}
            title="No appointments yet"
            description="Schedule your first appointment to see it here."
            actionLabel="Book appointment"
            onAction={onViewAll}
          />
        )}
      </div>
    </Card>
  );
};

export default RecentAppointments;
