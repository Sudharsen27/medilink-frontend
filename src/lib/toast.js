import toast from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const TOAST_DURATION = 4000;

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    bar: "bg-health-500",
    iconBg: "bg-health-100 text-health-700 dark:bg-health-900/50 dark:text-health-300",
    border: "border-health-200/80 dark:border-health-800/60",
  },
  error: {
    icon: XCircle,
    bar: "bg-clinical-rose",
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    border: "border-rose-200/80 dark:border-rose-800/60",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-amber-500",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    border: "border-amber-200/80 dark:border-amber-800/60",
  },
  info: {
    icon: Info,
    bar: "bg-clinical-blue",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    border: "border-blue-200/80 dark:border-blue-800/60",
  },
};

const PremiumToast = ({ t, message, type }) => {
  const variant = VARIANTS[type] || VARIANTS.info;
  const Icon = variant.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        pointer-events-auto relative w-full min-w-0
        flex items-center gap-3 pl-4 pr-3 py-3.5 rounded-2xl
        bg-white dark:bg-slate-900
        border shadow-soft ${variant.border}
        ${t.visible ? "animate-toast-enter" : "animate-toast-exit"}
      `}
    >
      <div
        className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${variant.bar}`}
        aria-hidden="true"
      />

      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${variant.iconBg}`}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>

      <p className="flex-1 min-w-0 text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
        {message}
      </p>

      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

const notify = (message, type = "info", options = {}) => {
  const resolvedType = VARIANTS[type] ? type : "info";
  const toastId = options.id ?? `${resolvedType}::${message}`;

  return toast.custom(
    (t) => <PremiumToast t={t} message={message} type={resolvedType} />,
    {
      duration: options.duration ?? TOAST_DURATION,
      id: toastId,
      position: options.position,
    }
  );
};

export const showSuccess = (message, options) => notify(message, "success", options);
export const showError = (message, options) => notify(message, "error", options);
export const showWarning = (message, options) => notify(message, "warning", options);
export const showInfo = (message, options) => notify(message, "info", options);

export const dismissToast = (id) => toast.dismiss(id);
export const dismissAllToasts = () => toast.dismiss();

export { notify, toast as hotToast };
export default notify;
