import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, Stethoscope } from "lucide-react";
import Button from "../../ui/Button";

const BookingSuccess = ({ doctor, date, time, onViewAppointments, onBookAnother }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="text-center py-8 px-4"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
      className="w-20 h-20 mx-auto mb-6 rounded-full bg-health-100 dark:bg-health-900/40 flex items-center justify-center"
    >
      <CheckCircle2 className="w-10 h-10 text-health-600 dark:text-health-400" />
    </motion.div>

    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
      Appointment confirmed!
    </h2>
    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
      Your visit has been scheduled. You&apos;ll receive a confirmation notification shortly.
    </p>

    <div className="health-card p-5 max-w-md mx-auto text-left space-y-3 mb-8">
      <div className="flex items-center gap-3 text-sm">
        <Stethoscope className="w-5 h-5 text-health-600 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-xs text-slate-500">Doctor</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {doctor?.name || doctor?.specialization}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Calendar className="w-5 h-5 text-health-600 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-xs text-slate-500">Date</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {date?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Clock className="w-5 h-5 text-health-600 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-xs text-slate-500">Time</p>
          <p className="font-semibold text-slate-900 dark:text-white">{time}</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
      <Button className="flex-1" onClick={onViewAppointments}>
        View appointments
      </Button>
      <Button variant="secondary" className="flex-1" onClick={onBookAnother}>
        Book another
      </Button>
    </div>
  </motion.div>
);

export default BookingSuccess;
