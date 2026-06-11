import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const HOLD_MS = 3000;

const SosButton = ({ onActivate }) => {
  const holdTimer = useRef(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);

  const clearHold = useCallback(() => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    setHolding(false);
    setHoldProgress(0);
  }, []);

  const startHold = useCallback(() => {
    setHolding(true);
    const started = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - started;
      const progress = Math.min(elapsed / HOLD_MS, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        clearHold();
        onActivate();
      }
    }, 50);
  }, [onActivate, clearHold]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <motion.span
          className="absolute inset-0 rounded-full bg-rose-500/30"
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={onActivate}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            startHold();
          }}
          onPointerUp={clearHold}
          onPointerLeave={clearHold}
          onPointerCancel={clearHold}
          className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-[0_12px_40px_rgba(244,63,94,0.45)] hover:shadow-[0_16px_48px_rgba(244,63,94,0.55)] active:scale-[0.97] transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          aria-label="Emergency SOS — tap or press and hold for 3 seconds"
        >
          {holding && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${holdProgress * 289} 289`}
              />
            </svg>
          )}
          <span className="flex flex-col items-center gap-1 relative z-10">
            <span className="text-4xl sm:text-5xl font-black tracking-widest">SOS</span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] opacity-90">
              EMERGENCY
            </span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {[
          { step: "1", text: "Press SOS button" },
          { step: "2", text: "5-second countdown" },
          { step: "3", text: "Contacts & services alerted" },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50"
          >
            <span className="shrink-0 w-7 h-7 rounded-lg bg-health-600 text-white text-xs font-bold flex items-center justify-center">
              {item.step}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SosButton;
