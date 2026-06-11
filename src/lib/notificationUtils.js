import {
  CalendarClock,
  Stethoscope,
  Pill,
  Bell,
  AlertTriangle,
  Info,
} from "lucide-react";

export const NOTIFICATION_CATEGORIES = [
  { id: "all", label: "All", types: null },
  {
    id: "appointments",
    label: "Appointments",
    types: ["appointment", "reminder"],
  },
  {
    id: "medical",
    label: "Medical Alerts",
    types: ["medical", "medical_record", "emergency"],
  },
  {
    id: "prescriptions",
    label: "Prescriptions",
    types: ["prescription"],
  },
  { id: "system", label: "System", types: ["system"] },
];

export const READ_FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
];

const TYPE_META = {
  appointment: {
    icon: CalendarClock,
    label: "Appointment",
    accent: "health",
    route: (n) =>
      n.related_entity_id
        ? `/appointments?highlight=${n.related_entity_id}`
        : "/appointments",
  },
  reminder: {
    icon: CalendarClock,
    label: "Reminder",
    accent: "amber",
    route: () => "/appointments",
  },
  medical: {
    icon: Stethoscope,
    label: "Medical",
    accent: "rose",
    route: () => "/medical-records",
  },
  medical_record: {
    icon: Stethoscope,
    label: "Medical Record",
    accent: "rose",
    route: (n) =>
      n.related_entity_id
        ? `/medical-records?open=${n.related_entity_id}`
        : "/medical-records",
  },
  emergency: {
    icon: AlertTriangle,
    label: "Emergency",
    accent: "rose",
    route: () => "/emergency",
  },
  prescription: {
    icon: Pill,
    label: "Prescription",
    accent: "blue",
    route: (n) =>
      n.related_entity_id
        ? `/prescriptions?open=${n.related_entity_id}`
        : "/prescriptions",
  },
  system: {
    icon: Info,
    label: "System",
    accent: "slate",
    route: () => "/notifications",
  },
};

const ACCENT_STYLES = {
  health: {
    icon: "bg-health-100 text-health-700 dark:bg-health-900/40 dark:text-health-300",
    border: "border-health-200/60 dark:border-health-800/40",
    dot: "bg-health-500",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    border: "border-amber-200/60 dark:border-amber-800/40",
    dot: "bg-amber-500",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    border: "border-rose-200/60 dark:border-rose-800/40",
    dot: "bg-clinical-rose",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    border: "border-blue-200/60 dark:border-blue-800/40",
    dot: "bg-clinical-blue",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    border: "border-slate-200/60 dark:border-slate-700/40",
    dot: "bg-slate-400",
  },
};

export const getNotificationMeta = (notification) => {
  const type = notification?.type || "system";
  const meta = TYPE_META[type] || {
    icon: Bell,
    label: "Notification",
    accent: "slate",
    route: () => "/notifications",
  };
  return {
    ...meta,
    styles: ACCENT_STYLES[meta.accent] || ACCENT_STYLES.slate,
  };
};

export const formatNotificationTime = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const groupNotificationsByDate = (notifications) => {
  const groups = [];
  const map = new Map();

  const labelForDate = (date) => {
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((startToday - startTarget) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return "This week";
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  };

  notifications.forEach((notification) => {
    const created = new Date(notification.created_at);
    const label = labelForDate(created);
    if (!map.has(label)) {
      map.set(label, []);
      groups.push({ label, items: map.get(label) });
    }
    map.get(label).push(notification);
  });

  return groups;
};

export const getCategoryTypes = (categoryId) => {
  const category = NOTIFICATION_CATEGORIES.find((c) => c.id === categoryId);
  return category?.types ?? null;
};

export const isNotificationUnread = (notification) =>
  !notification?.read && !notification?.is_read;
