import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Star, CheckCircle2 } from "lucide-react";
import { Skeleton } from "../../ui/Skeleton";

const DoctorSelector = ({ doctors, selectedDoctor, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <p className="text-center text-slate-500 py-8">No doctors available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
      {doctors.map((doctor) => {
        const selected = selectedDoctor?.id === doctor.id;
        const name = doctor.name || doctor.specialization || "Doctor";

        return (
          <motion.button
            key={doctor.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(doctor)}
            className={`relative text-left p-4 rounded-card-lg border-2 transition-all duration-200 ${
              selected
                ? "border-health-500 bg-health-50 dark:bg-health-950/30 shadow-glow"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-health-300 hover:shadow-soft"
            }`}
            aria-pressed={selected}
          >
            {selected && (
              <CheckCircle2
                className="absolute top-3 right-3 w-5 h-5 text-health-600"
                aria-hidden="true"
              />
            )}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-health-100 dark:bg-health-900/40 flex items-center justify-center shrink-0">
                {doctor.photo_url ? (
                  <img
                    src={doctor.photo_url}
                    alt=""
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <Stethoscope className="w-6 h-6 text-health-600" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {name}
                </p>
                <p className="text-sm text-health-600 dark:text-health-400 truncate">
                  {doctor.specialization}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {Number(doctor.rating || 4.5).toFixed(1)} · {doctor.experience || 0} yrs
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default DoctorSelector;
