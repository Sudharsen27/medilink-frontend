import React, { createContext, useContext, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import notify, {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  dismissToast,
  dismissAllToasts,
} from "../lib/toast";

const ToastContext = createContext(null);

/**
 * Backward-compatible hook — existing code uses addToast(message, type).
 * Also exposes typed helpers: success, error, warning, info.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const addToast = useCallback((message, type = "info", options) => {
    return notify(message, type, options);
  }, []);

  const removeToast = useCallback((id) => {
    dismissToast(id);
  }, []);

  const value = {
    addToast,
    removeToast,
    dismissAll: dismissAllToasts,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerClassName="medilink-toaster"
        containerStyle={{
          top: "max(0.75rem, env(safe-area-inset-top))",
        }}
        toastOptions={{
          duration: 4000,
          custom: {
            style: {
              background: "transparent",
              boxShadow: "none",
              padding: 0,
              margin: 0,
              width: "100%",
              maxWidth: "min(22rem, calc(100vw - 2rem))",
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};
