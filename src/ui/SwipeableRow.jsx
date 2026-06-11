import React, { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const SWIPE_THRESHOLD = 72;
const ACTION_WIDTH = 72;

/**
 * Swipe-left row revealing action buttons (iOS / native feel).
 */
const SwipeableRow = ({
  children,
  actions = [],
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const x = useMotionValue(0);
  const maxDrag = -(actions.length * ACTION_WIDTH);
  const actionOpacity = useTransform(x, [0, maxDrag], [0, 1]);

  const snap = (value) => {
    const shouldOpen = value < -SWIPE_THRESHOLD;
    setOpen(shouldOpen);
    animate(x, shouldOpen ? maxDrag : 0, { type: "spring", stiffness: 400, damping: 35 });
  };

  if (!actions.length) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <motion.div
        style={{ opacity: actionOpacity }}
        className="absolute inset-y-0 right-0 flex"
        aria-hidden="true"
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              action.onClick?.();
              snap(0);
            }}
            className={`w-[72px] flex flex-col items-center justify-center gap-1 text-white text-[10px] font-semibold ${action.className || "bg-health-600"}`}
            aria-label={action.label}
          >
            {action.icon && <action.icon className="w-5 h-5" />}
            {action.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: maxDrag, right: 0 }}
        dragElastic={0.08}
        style={{ x }}
        onDragEnd={(_, info) => snap(info.offset.x + (open ? maxDrag : 0))}
        className="relative z-10 bg-white dark:bg-slate-900/90 touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableRow;
