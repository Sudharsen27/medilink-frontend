import {
  FileText,
  FlaskConical,
  Scan,
  Brain,
  Droplets,
  Pill,
  Stethoscope,
  HeartPulse,
  Syringe,
  AlertTriangle,
} from "lucide-react";
import { apiUrl } from "../config/api";

export const RECORD_CATEGORIES = {
  all: {
    id: "all",
    label: "All records",
    icon: FileText,
    accent: "health",
    chip: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
    iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
  lab_report: {
    id: "lab_report",
    label: "Lab reports",
    icon: FlaskConical,
    accent: "blue",
    chip: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    dot: "bg-blue-500",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  },
  blood_test: {
    id: "blood_test",
    label: "Blood tests",
    icon: Droplets,
    accent: "rose",
    chip: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    dot: "bg-rose-500",
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  },
  x_ray: {
    id: "x_ray",
    label: "X-Ray",
    icon: Scan,
    accent: "violet",
    chip: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    dot: "bg-violet-500",
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
  },
  mri_scan: {
    id: "mri_scan",
    label: "MRI scans",
    icon: Brain,
    accent: "indigo",
    chip: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    dot: "bg-indigo-500",
    iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  },
  prescription: {
    id: "prescription",
    label: "Prescriptions",
    icon: Pill,
    accent: "health",
    chip: "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
    dot: "bg-health-500",
    iconBg: "bg-health-100 text-health-600 dark:bg-health-900/40 dark:text-health-400",
  },
  doctor_notes: {
    id: "doctor_notes",
    label: "Doctor notes",
    icon: Stethoscope,
    accent: "teal",
    chip: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
    dot: "bg-teal-500",
    iconBg: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
  },
  surgery_report: {
    id: "surgery_report",
    label: "Surgery",
    icon: HeartPulse,
    accent: "rose",
    chip: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    dot: "bg-rose-600",
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  },
  vaccination: {
    id: "vaccination",
    label: "Vaccinations",
    icon: Syringe,
    accent: "amber",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  },
  allergy_test: {
    id: "allergy_test",
    label: "Allergy tests",
    icon: AlertTriangle,
    accent: "orange",
    chip: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    dot: "bg-orange-500",
    iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  },
};

export const UPLOAD_CATEGORIES = Object.entries(RECORD_CATEGORIES)
  .filter(([key]) => key !== "all")
  .map(([, cat]) => cat);

export const getCategory = (type) =>
  RECORD_CATEGORIES[type] || RECORD_CATEGORIES.lab_report;

export const resolveRecordFileUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return apiUrl(fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`);
};

export const getFileExtension = (fileUrl) => {
  if (!fileUrl) return "";
  const path = fileUrl.split("?")[0];
  return path.split(".").pop()?.toLowerCase() || "";
};

export const canPreviewFile = (fileUrl) => {
  const ext = getFileExtension(fileUrl);
  return ["pdf", "png", "jpg", "jpeg", "webp", "gif"].includes(ext);
};

export const isImageFile = (fileUrl) =>
  ["png", "jpg", "jpeg", "webp", "gif"].includes(getFileExtension(fileUrl));

export const formatRecordDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const filterRecords = (records, { search = "", category = "all" } = {}) => {
  const term = search.trim().toLowerCase();
  return records.filter((record) => {
    const matchesCategory =
      category === "all" || record.record_type === category;
    if (!matchesCategory) return false;
    if (!term) return true;
    const haystack = [
      record.title,
      record.description,
      record.doctor_name,
      record.hospital,
      record.file_name,
      getCategory(record.record_type).label,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
};

export const groupRecordsByPeriod = (records) => {
  const sorted = [...records].sort(
    (a, b) => new Date(b.record_date || b.created_at) - new Date(a.record_date || a.created_at)
  );

  const groups = new Map();
  sorted.forEach((record) => {
    const d = new Date(record.record_date || record.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groups.has(key)) groups.set(key, { key, label, items: [] });
    groups.get(key).items.push(record);
  });

  return Array.from(groups.values());
};

export const getCategoryCounts = (records) => {
  const counts = { all: records.length };
  records.forEach((r) => {
    counts[r.record_type] = (counts[r.record_type] || 0) + 1;
  });
  return counts;
};
