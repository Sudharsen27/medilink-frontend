import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import cn from "../lib/cn";
import { layout } from "../design-system/tokens";

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[min(96vw,72rem)]",
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
  className = "",
  contentClassName = "",
}) => {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleEscape]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
              aria-describedby={description ? "modal-description" : undefined}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.21, 1.02, 0.73, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "pointer-events-auto w-full health-card rounded-2xl shadow-2xl dark:shadow-glass-lg-dark flex flex-col max-h-[min(90vh,720px)] overflow-hidden",
                sizeClasses[size],
                className
              )}
              style={{ maxWidth: layout.modalMaxWidth[size] || layout.modalMaxWidth.md }}
            >
              {(title || showClose) && (
                <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-200/80 dark:border-slate-700/60 shrink-0">
                  <div className="min-w-0">
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-lg font-display font-bold text-slate-900 dark:text-white"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="modal-description"
                        className="text-sm text-slate-500 dark:text-slate-400 mt-0.5"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  {showClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              <div className={cn("flex-1 overflow-y-auto p-5", contentClassName)}>
                {children}
              </div>

              {footer && (
                <div className="shrink-0 flex flex-col-reverse sm:flex-row gap-2 p-5 border-t border-slate-200/80 dark:border-slate-700/60">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
