import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Target,
  XCircle,
  FileText,
  HeartPulse,
  Phone,
  Activity,
  Stethoscope,
  Video,
  AlertTriangle,
  ChevronRight,
  Pill,
  Droplets,
  Bell,
  CalendarPlus,
  ShieldAlert,
  User,
} from "lucide-react";
import Card, { CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import StatsCard from "./StatsCard";
import { useMedicalRecords } from "../context/MedicalRecordsContext";
import { useEmergency } from "../context/EmergencyContext";
import { useEnhancedNotifications } from "../context/EnhancedNotificationsContext";
import { useActivity } from "../context/ActivityContext";
/* ─── Animation stagger ─── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ─── Helpers ─── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeStr) => timeStr || "TBD";

const formatRelativeTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const statusStyle = (status) => {
  const map = {
    confirmed: "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };
  return map[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ═══════════════════════════════════════════
   WELCOME CARD
═══════════════════════════════════════════ */
const WelcomeCard = ({ user, upcomingCount, recordsCount }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Card
      glass
      padding="lg"
      className="relative overflow-hidden bg-gradient-to-br from-health-600 to-health-800 border-health-500/30 text-white"
    >
      <div
        className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-health-400/20 blur-xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/20 border border-white/30 shrink-0">
            {user?.photo ? (
              <img src={user.photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
            )}
          </div>
          <div>
            <p className="text-health-100 text-sm font-medium">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mt-0.5">
              {getGreeting()}, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-health-100/90 text-sm mt-1">
              Your health command center — everything in one place.
            </p>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1 sm:flex-none text-center px-4 py-3 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <p className="text-2xl font-bold tabular-nums">{upcomingCount}</p>
            <p className="text-xs text-health-100 mt-0.5">Upcoming</p>
          </div>
          <div className="flex-1 sm:flex-none text-center px-4 py-3 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <p className="text-2xl font-bold tabular-nums">{recordsCount}</p>
            <p className="text-xs text-health-100 mt-0.5">Records</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════
   UPCOMING APPOINTMENTS
═══════════════════════════════════════════ */
const UpcomingAppointmentsWidget = ({ appointments, onViewAll, onBook }) => {
  const upcoming = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return [...appointments]
      .filter((a) => {
        if (!a.date) return false;
        const d = new Date(a.date);
        return d >= now && a.status !== "cancelled" && a.status !== "completed";
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 4);
  }, [appointments]);

  return (
    <Card padding="md">
      <CardHeader
        title="Upcoming Appointments"
        subtitle="Your next scheduled visits"
        action={
          <Button variant="ghost" size="sm" onClick={onViewAll} icon={ChevronRight}>
            View all
          </Button>
        }
      />

      {upcoming.length > 0 ? (
        <div className="space-y-3">
          {upcoming.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center gap-4 p-4 rounded-card bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-soft transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-health-100 dark:bg-health-900/40 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-health-600 uppercase">
                  {new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-lg font-bold text-health-700 dark:text-health-300 leading-none">
                  {new Date(appt.date).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {appt.title || appt.doctorName || "Appointment"}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {formatTime(appt.time)}
                  {appt.doctorName && ` · Dr. ${appt.doctorName}`}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize shrink-0 ${statusStyle(appt.status)}`}>
                {appt.status || "pending"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No upcoming visits"
          description="Schedule your next appointment with a healthcare provider."
          actionLabel="Book appointment"
          onAction={onBook}
        />
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════
   HEALTH SUMMARY
═══════════════════════════════════════════ */
const HealthSummaryCard = ({ medicalInfo, onViewProfile }) => {
  const allergies = medicalInfo?.allergies?.length
    ? medicalInfo.allergies.join(", ")
    : "None recorded";
  const medications = medicalInfo?.medications?.length
    ? medicalInfo.medications.join(", ")
    : "None recorded";
  const conditions = medicalInfo?.conditions?.length
    ? medicalInfo.conditions.join(", ")
    : "None recorded";

  const rows = [
    { icon: Droplets, label: "Blood type", value: medicalInfo?.blood_type || "Not set" },
    { icon: AlertTriangle, label: "Allergies", value: allergies },
    { icon: Pill, label: "Medications", value: medications },
    { icon: HeartPulse, label: "Conditions", value: conditions },
  ];

  return (
    <Card padding="md" className="h-full">
      <CardHeader
        title="Health Summary"
        subtitle="Your medical profile at a glance"
        action={
          <Button variant="ghost" size="sm" onClick={onViewProfile}>
            Edit
          </Button>
        }
      />
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40"
          >
            <div className="w-9 h-9 rounded-lg bg-health-100 dark:bg-health-900/40 flex items-center justify-center shrink-0">
              <row.icon className="w-4 h-4 text-health-600 dark:text-health-400" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {row.label}
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════
   MEDICAL RECORDS CARD
═══════════════════════════════════════════ */
const MedicalRecordsCard = ({ records, stats, onViewAll }) => {
  const recent = records.slice(0, 3);

  return (
    <Card padding="md" className="h-full">
      <CardHeader
        title="Medical Records"
        subtitle={`${stats.total} document${stats.total !== 1 ? "s" : ""} on file`}
        action={
          <Button variant="ghost" size="sm" onClick={onViewAll} icon={ChevronRight}>
            View all
          </Button>
        }
      />

      {recent.length > 0 ? (
        <div className="space-y-2">
          {recent.map((record) => (
            <div
              key={record.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {record.title || record.file_name || "Medical record"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {record.record_type || "document"} · {formatDate(record.created_at || record.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No records yet"
          description="Upload lab results, prescriptions, and reports."
          actionLabel="Add record"
          onAction={onViewAll}
        />
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════
   EMERGENCY CONTACTS
═══════════════════════════════════════════ */
const EmergencyContactsCard = ({ contacts, services, onManage }) => {
  const primary = contacts.find((c) => c.is_primary) || contacts[0];
  const hotline = services?.[0];

  return (
    <Card padding="md" className="h-full border-rose-200/60 dark:border-rose-900/40">
      <CardHeader
        title="Emergency Contacts"
        subtitle="Quick access when you need help"
        action={
          <Button variant="ghost" size="sm" onClick={onManage}>
            Manage
          </Button>
        }
      />

      <div className="space-y-3">
        {primary && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                <User className="w-5 h-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Primary contact
                </p>
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {primary.name || "Emergency Contact"}
                </p>
                <p className="text-sm text-slate-500">{primary.relationship}</p>
              </div>
              {primary.phone ? (
                <a
                  href={`tel:${primary.phone}`}
                  className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  aria-label={`Call ${primary.name}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
              ) : (
                <Button variant="danger" size="sm" onClick={onManage}>
                  Add
                </Button>
              )}
            </div>
          </div>
        )}

        {hotline && (
          <a
            href={`tel:${hotline.number}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{hotline.name}</p>
              <p className="text-lg font-bold text-rose-600 tabular-nums">{hotline.number}</p>
            </div>
          </a>
        )}

        {contacts.length > 1 && (
          <p className="text-xs text-slate-500 text-center">
            +{contacts.length - 1} more contact{contacts.length > 2 ? "s" : ""}
          </p>
        )}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════
   ACTIVITY TIMELINE
═══════════════════════════════════════════ */
const RecentActivityTimeline = ({ activities }) => {
  const timelineIcons = {
    appointment: Calendar,
    notification: Bell,
    record: FileText,
    default: Activity,
  };

  return (
    <Card padding="md">
      <CardHeader title="Recent Activity" subtitle="Your latest health events" />

      {activities.length > 0 ? (
        <ol className="relative space-y-0" aria-label="Recent activity timeline">
          {activities.map((act, i) => {
            const Icon = timelineIcons[act.type] || timelineIcons.default;
            const isLast = i === activities.length - 1;
            return (
              <li key={act.id} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[17px] top-9 bottom-0 w-px bg-slate-200 dark:bg-slate-700"
                    aria-hidden="true"
                  />
                )}
                <div className="w-9 h-9 rounded-full bg-health-100 dark:bg-health-900/40 border-2 border-white dark:border-slate-900 flex items-center justify-center shrink-0 z-10">
                  <Icon className="w-4 h-4 text-health-600 dark:text-health-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{act.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{act.description}</p>
                  <time className="text-[11px] text-slate-400 mt-1 block">{act.time}</time>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState
          icon={Activity}
          title="No recent activity"
          description="Your appointments and health updates will appear here."
        />
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════
   PATIENT QUICK ACTIONS
═══════════════════════════════════════════ */
const PatientQuickActions = ({ onAction, unreadCount }) => {
  const actions = [
    { id: "book", label: "Book Visit", icon: CalendarPlus, color: "health" },
    { id: "records", label: "Records", icon: FileText, color: "blue" },
    { id: "telemedicine", label: "Telemedicine", icon: Video, color: "violet" },
    { id: "doctors", label: "Find Doctor", icon: Stethoscope, color: "green" },
    { id: "emergency", label: "Emergency", icon: ShieldAlert, color: "rose" },
    { id: "notifications", label: "Alerts", icon: Bell, color: "amber", badge: unreadCount },
  ];

  const colors = {
    health: "bg-health-100 text-health-700 dark:bg-health-900/40 dark:text-health-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };

  return (
    <Card padding="md">
      <CardHeader title="Quick Actions" subtitle="Jump to common tasks" />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAction(action.id)}
              className="relative flex flex-col items-center gap-2 p-3 rounded-card border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40 hover:shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-500"
            >
              <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${colors[action.color]}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
                {action.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-clinical-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════
   APPOINTMENT STATISTICS
═══════════════════════════════════════════ */
const AppointmentStatistics = ({ stats, onStatClick }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
    <StatsCard title="Total" value={stats.total} color="blue" icon={Calendar} onClick={() => onStatClick("total")} />
    <StatsCard title="Pending" value={stats.pending} color="yellow" icon={Clock} onClick={() => onStatClick("pending")} />
    <StatsCard title="Confirmed" value={stats.confirmed} color="green" icon={CheckCircle2} onClick={() => onStatClick("confirmed")} />
    <StatsCard title="Completed" value={stats.completed} color="purple" icon={Target} onClick={() => onStatClick("completed")} />
    <StatsCard title="Cancelled" value={stats.cancelled} color="red" icon={XCircle} onClick={() => onStatClick("cancelled")} />
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PATIENT DASHBOARD
═══════════════════════════════════════════ */
const PatientDashboard = ({
  user,
  appointments = [],
  stats,
  onStatClick,
  onViewAllAppointments,
  onNewAppointment,
  onQuickAction,
  unreadNotifications = 0,
}) => {
  const navigate = useNavigate();
  const { medicalRecords, fetchRecords, getRecordsStats } = useMedicalRecords();
  const { emergencyContacts, medicalInfo, emergencyServices } = useEmergency();
  const { notifications } = useEnhancedNotifications();
  const { activityLog } = useActivity();

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const recordsStats = getRecordsStats();

  const upcomingCount = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return appointments.filter((a) => {
      if (!a.date) return false;
      return new Date(a.date) >= now && a.status !== "cancelled" && a.status !== "completed";
    }).length;
  }, [appointments]);

  const timelineActivities = useMemo(() => {
    const items = [];

    appointments.slice(0, 5).forEach((appt) => {
      items.push({
        id: `appt-${appt.id}`,
        type: "appointment",
        title: appt.title || "Appointment scheduled",
        description: `${formatDate(appt.date)} at ${formatTime(appt.time)} · ${appt.status || "pending"}`,
        time: formatDate(appt.date),
        sortDate: new Date(appt.date || 0),
      });
    });

    (notifications || []).slice(0, 5).forEach((n) => {
      items.push({
        id: `notif-${n.id}`,
        type: "notification",
        title: n.title || n.message || "Notification",
        description: n.message || n.type || "Update",
        time: n.created_at ? formatRelativeTime(n.created_at) : "Recently",
        sortDate: new Date(n.created_at || Date.now()),
      });
    });

    (activityLog || []).slice(-5).forEach((log, i) => {
      items.push({
        id: `log-${i}`,
        type: "default",
        title: log.message,
        description: "Activity logged",
        time: formatRelativeTime(log.timestamp),
        sortDate: new Date(log.timestamp),
      });
    });

    return items
      .sort((a, b) => b.sortDate - a.sortDate)
      .slice(0, 8);
  }, [appointments, notifications, activityLog]);

  const handleQuickAction = (actionId) => {
    if (onQuickAction) {
      onQuickAction(actionId);
      return;
    }
    switch (actionId) {
      case "book":
        onNewAppointment?.();
        break;
      case "records":
        navigate("/medical-records");
        break;
      case "telemedicine":
        navigate("/telemedicine");
        break;
      case "doctors":
        navigate("/doctors");
        break;
      case "emergency":
        navigate("/emergency");
        break;
      case "notifications":
        navigate("/notifications");
        break;
      default:
        break;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 lg:space-y-8">
      <motion.div variants={item}>
        <WelcomeCard
          user={user}
          upcomingCount={upcomingCount}
          recordsCount={recordsStats.total}
        />
      </motion.div>

      <motion.div variants={item}>
        <AppointmentStatistics stats={stats} onStatClick={onStatClick} />
      </motion.div>

      <motion.div variants={item}>
        <PatientQuickActions
          onAction={handleQuickAction}
          unreadCount={unreadNotifications}
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <motion.div variants={item}>
            <UpcomingAppointmentsWidget
              appointments={appointments}
              onViewAll={onViewAllAppointments}
              onBook={onNewAppointment}
            />
          </motion.div>
          <motion.div variants={item}>
            <RecentActivityTimeline activities={timelineActivities} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={item}>
            <HealthSummaryCard
              medicalInfo={medicalInfo}
              onViewProfile={() => navigate("/patient-profile")}
            />
          </motion.div>
          <motion.div variants={item}>
            <MedicalRecordsCard
              records={medicalRecords}
              stats={recordsStats}
              onViewAll={() => navigate("/medical-records")}
            />
          </motion.div>
          <motion.div variants={item}>
            <EmergencyContactsCard
              contacts={emergencyContacts}
              services={emergencyServices}
              onManage={() => navigate("/emergency")}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientDashboard;
