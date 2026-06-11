import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Briefcase,
  CalendarPlus,
  Stethoscope,
} from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import Button from "../ui/Button";

const AvailabilityBadge = ({ isActive }) => {
  const available = isActive !== false;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        available
          ? "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${available ? "bg-health-500 animate-pulse" : "bg-slate-400"}`}
        aria-hidden="true"
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
};

const DoctorMarketplaceCard = ({ doctor, index = 0 }) => {
  const navigate = useNavigate();
  const displayName = doctor.name || "Doctor";
  const rating = Number(doctor.rating) || 4.5;
  const experience = doctor.experience ?? doctor.experience_years ?? 0;

  const handleBook = (e) => {
    e.stopPropagation();
    navigate(`/appointments/book/${doctor.id}`);
  };

  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group health-card overflow-hidden flex flex-col hover:shadow-glow transition-shadow duration-300"
    >
      {/* Header / avatar */}
      <div className="relative h-36 sm:h-40 bg-gradient-to-br from-health-50 to-health-100/80 dark:from-health-950/50 dark:to-health-900/30 flex items-center justify-center overflow-hidden">
        {doctor.photo_url ? (
          <img
            src={doctor.photo_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-soft">
            <Stethoscope className="w-10 h-10 text-health-600 dark:text-health-400" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <AvailabilityBadge isActive={doctor.is_active} />
        </div>
        <div className="absolute top-3 right-3">
          <FavoriteButton doctor={doctor} size="small" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
            {displayName}
          </h3>
          <p className="text-sm font-medium text-health-600 dark:text-health-400 mt-0.5">
            {doctor.specialization || "General Practice"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-3">
          <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            {rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
            {experience} yrs
          </span>
        </div>

        {doctor.clinic_address && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mb-3 line-clamp-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            {doctor.clinic_address}
          </p>
        )}

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1 mb-4">
          {doctor.bio || "Experienced healthcare professional dedicated to patient care."}
        </p>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleViewProfile}
          >
            Profile
          </Button>
          <Button
            size="sm"
            className="flex-1"
            icon={CalendarPlus}
            onClick={handleBook}
            disabled={doctor.is_active === false}
          >
            Book
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default DoctorMarketplaceCard;
