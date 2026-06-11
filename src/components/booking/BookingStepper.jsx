import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { id: 1, label: "Doctor" },
  { id: 2, label: "Date" },
  { id: 3, label: "Time" },
  { id: 4, label: "Confirm" },
];

const BookingStepper = ({ currentStep, onStepClick }) => (
  <nav aria-label="Booking progress" className="mb-8">
    <ol className="flex items-center justify-between gap-1 sm:gap-2">
      {STEPS.map((step, index) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        const clickable = done && onStepClick;

        return (
          <li key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(step.id)}
              className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 w-full ${
                clickable ? "cursor-pointer" : "cursor-default"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <motion.span
                layout
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300 ${
                  done
                    ? "bg-health-600 text-white"
                    : active
                    ? "bg-health-600 text-white ring-4 ring-health-100 dark:ring-health-900/50"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                }`}
              >
                {done ? <Check className="w-4 h-4" aria-hidden="true" /> : step.id}
              </motion.span>
              <span
                className={`text-[10px] sm:text-xs font-semibold text-center sm:text-left ${
                  active || done
                    ? "text-health-700 dark:text-health-400"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`hidden sm:block flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                  currentStep > step.id ? "bg-health-500" : "bg-slate-200 dark:bg-slate-700"
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default BookingStepper;
