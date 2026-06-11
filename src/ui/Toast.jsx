/**
 * MediLink toast design system
 * Wraps react-hot-toast with premium healthcare styling (see lib/toast.js)
 */
import { Toaster } from "react-hot-toast";
import {
  notify,
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

export const ToastProvider = ({ children }) => (
  <>
    {children}
    <Toaster toastOptions={{ duration: 4000 }} {...toastConfig} />
  </>
);

export {
  notify,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  dismissToast,
  dismissAllToasts,
};

export default notify;
