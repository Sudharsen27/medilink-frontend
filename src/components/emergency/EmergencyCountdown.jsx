import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";

const EmergencyCountdown = ({ countdown, contacts, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md text-center"
    >
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(244,63,94,0.2)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(countdown / 5) * 276} 276`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-6xl font-black text-rose-500 tabular-nums">
          {countdown}
        </span>
      </div>

      <h2 className="text-2xl font-display font-bold text-white mb-2">Emergency SOS activated</h2>
      <p className="text-amber-400 font-medium mb-1">
        Alerting services in {countdown} second{countdown !== 1 ? "s" : ""}
      </p>
      <p className="text-sm text-slate-400 mb-8">
        Move to a safe location if possible. Help is on the way.
      </p>

      <Button variant="secondary" size="lg" onClick={onCancel} className="w-full mb-6">
        Cancel emergency
      </Button>

      {contacts?.filter((c) => c.is_primary).length > 0 && (
        <Card padding="sm" className="text-left !p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            Primary contacts will be notified
          </p>
          <div className="space-y-2">
            {contacts
              .filter((c) => c.is_primary)
              .map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{c.name}</span>
                  <Badge variant="outline" size="sm">
                    {c.relationship}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-center gap-2 mt-6 text-rose-400 text-xs">
        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
        <span>Do not close this screen until help arrives</span>
      </div>
    </motion.div>
  </div>
);

export default EmergencyCountdown;
