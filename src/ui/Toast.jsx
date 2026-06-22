/**
 * MediLink toast design system
 * Single source: ToastContext mounts the Toaster; lib/toast.js renders premium toasts.
 */
export { ToastProvider, useToast } from "../context/ToastContext";
export {
  default,
  default as notify,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  dismissToast,
  dismissAllToasts,
} from "../lib/toast";

export const toastConfig = {
  containerClassName: "medilink-toaster",
  position: "top-center",
  gutter: 12,
};
