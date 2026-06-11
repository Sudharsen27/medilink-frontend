import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import cn from "../lib/cn";

const sideClasses = {
  bottom: "inset-x-0 bottom-0 rounded-t-3xl max-h-[min(88vh,640px)]",
  right: "inset-y-0 right-0 h-full w-full max-w-md rounded-l-3xl",
};

const sideAnimations = {
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
};

const Sheet = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "bottom",
  showClose = true,
  draggable = true,
  className = "",
}) => {
  const anim = sideAnimations[side] || sideAnimations.bottom;

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
            className="fixed inset-0 z-[55] bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "sheet-title" : undefined}
            {...anim}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            drag={draggable && side === "bottom" ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (side === "bottom" && (info.offset.y > 80 || info.velocity.y > 400)) {
                onClose?.();
              }
            }}
            className={cn(
              "fixed z-[56] glass-panel shadow-glass-lg-dark flex flex-col mobile-sheet-safe-bottom",
              sideClasses[side],
              className
            )}
          >
            {side === "bottom" && (
              <div className="flex justify-center pt-3 pb-1 shrink-0" aria-hidden="true">
                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
            )}

            {(title || showClose) && (
              <div className="flex items-start justify-between gap-3 px-5 py-3 border-b border-slate-200/70 dark:border-slate-700/60 shrink-0">
                <div className="min-w-0">
                  {title && (
                    <h2
                      id="sheet-title"
                      className="text-lg font-display font-bold text-slate-900 dark:text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

            {footer && (
              <div className="shrink-0 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700/60">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sheet;
