import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  Stethoscope,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { fetchTelemedicineAppointments } from "../api/telemedicine";
import PageContainer from "../ui/PageContainer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Eyebrow, Heading } from "../ui/Typography";
import { SkeletonScreen, Skeleton } from "../ui/Skeleton";

const statusVariant = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "confirmed" || s === "in-progress") return "success";
  if (s === "pending" || s === "reschedule_requested") return "warning";
  if (s === "scheduled") return "info";
  return "default";
};

const formatDate = (value) => {
  if (!value) return "Date TBD";
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "—";
  return String(value).slice(0, 5);
};

const isJoinable = (appointment) => {
  const status = String(appointment.status || "").toLowerCase();
  return !["cancelled", "completed", "no_show"].includes(status);
};

const TelemedicineList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const data = await fetchTelemedicineAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setError("Could not load video consultations.");
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  if (loading) {
    return (
      <PageContainer maxWidth="max-w-4xl">
        <SkeletonScreen label="Loading telemedicine" className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-36 w-full" rounded="rounded-2xl" />
          <Skeleton className="h-36 w-full" rounded="rounded-2xl" />
        </SkeletonScreen>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <Eyebrow>Virtual care</Eyebrow>
          <Heading level={1} className="mt-1">
            Telemedicine
          </Heading>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join video consultations with your care team from home.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={RefreshCw}
            onClick={() => loadAppointments(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <Link to="/doctors">
            <Button size="sm" variant="primary">
              Book visit
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Card padding="sm" className="!p-4 mb-4 border-rose-200 dark:border-rose-900/40">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        </Card>
      )}

      {appointments.length === 0 ? (
        <Card padding="lg" className="text-center !py-14">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-health-50 dark:bg-health-950/30 flex items-center justify-center">
            <Video className="w-7 h-7 text-health-600 dark:text-health-400" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">
            No video visits scheduled
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Book a telemedicine appointment with a doctor, then return here to join the call.
          </p>
          <Link to="/doctors">
            <Button variant="primary" icon={Stethoscope}>
              Find a doctor
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const date = appointment.appointment_date || appointment.date;
            const time = appointment.appointment_time || appointment.time;
            const doctor = appointment.doctor_name || "Your doctor";
            const joinable = isJoinable(appointment);

            return (
              <Card
                key={appointment.id}
                padding="md"
                className="!p-5 sm:!p-6 hover:shadow-soft transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center shrink-0 shadow-soft">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {doctor}
                        </h3>
                        <Badge
                          variant={statusVariant(appointment.status)}
                          size="sm"
                          className="capitalize"
                        >
                          {String(appointment.status || "scheduled").replace(/_/g, " ")}
                        </Badge>
                        {(appointment.appointment_type === "telemedicine" ||
                          appointment.appointment_type === "video") && (
                          <Badge variant="info" size="sm">
                            Video
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {appointment.doctor_specialization || "General Practice"}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-health-600" />
                          {formatDate(date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-health-600" />
                          {formatTime(time)}
                        </span>
                      </div>
                      {appointment.reason && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 lg:text-right">
                    {joinable ? (
                      <Link to={`/telemedicine/${appointment.id}`}>
                        <Button variant="primary" icon={ArrowRight} className="w-full lg:w-auto">
                          Join consultation
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" disabled className="w-full lg:w-auto">
                        Not available
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card padding="md" className="mt-8 !p-5 bg-health-50/40 dark:bg-health-950/20 border-health-100 dark:border-health-900/30">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
          How it works
        </h3>
        <ol className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <span className="font-semibold text-health-700 dark:text-health-400">1.</span> Book a
            telemedicine slot with your doctor
          </li>
          <li>
            <span className="font-semibold text-health-700 dark:text-health-400">2.</span> Join a few
            minutes before your scheduled time
          </li>
          <li>
            <span className="font-semibold text-health-700 dark:text-health-400">3.</span> Chat and
            video consult — prescriptions appear under Pharmacy
          </li>
        </ol>
      </Card>
    </PageContainer>
  );
};

export default TelemedicineList;
