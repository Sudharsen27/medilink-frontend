import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Video,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import { apiUrl } from "../config/api";
import { createAppointment } from "../api/appointments";
import { useToast } from "../context/ToastContext";
import PageContainer from "../ui/PageContainer";
import Card, { CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import BookingStepper from "../components/booking/BookingStepper";
import DoctorSelector from "../components/booking/DoctorSelector";
import BookingCalendar from "../components/booking/BookingCalendar";
import SlotPicker from "../components/booking/SlotPicker";
import BookingSuccess from "../components/booking/BookingSuccess";

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [smartSlots, setSmartSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [consultationType, setConsultationType] = useState("video");
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDoctors = useCallback(async () => {
    try {
      setDoctorsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/doctors"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch {
      setDoctors([]);
      addToast("Failed to load doctors", "error");
    } finally {
      setDoctorsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (!doctorId || !doctors.length) return;
    const found = doctors.find((d) => String(d.id) === String(doctorId));
    if (found) {
      setSelectedDoctor(found);
      setStep(2);
    }
  }, [doctorId, doctors]);

  useEffect(() => {
    if (!selectedDoctor?.id || !selectedDate) return;

    const loadSmartSlots = async () => {
      setSlotsLoading(true);
      setSmartSlots(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          apiUrl(
            `/api/smart-appointments/smart-slots?doctorId=${selectedDoctor.id}`
          ),
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (res.ok) {
          const data = await res.json();
          const raw = data.slots || [];
          const formatted = raw.map((s) => {
            if (typeof s === "string") return s;
            if (s.time) return s.time;
            if (s.hour != null) {
              const h = Number(s.hour);
              const period = h >= 12 ? "PM" : "AM";
              const hour12 = h % 12 || 12;
              return `${hour12}:00 ${period}`;
            }
            return null;
          }).filter(Boolean);
          if (formatted.length) setSmartSlots(formatted);
        }
      } catch {
        /* fallback to default slots in SlotPicker */
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSmartSlots();
  }, [selectedDoctor?.id, selectedDate]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedDoctor;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedSlot;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!canProceed()) {
      addToast("Please complete this step before continuing", "error");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      addToast("Please complete all booking details", "error");
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment({
        date: formatDateISO(selectedDate),
        time: selectedSlot,
        doctorName:
          selectedDoctor.name ||
          selectedDoctor.specialization ||
          "Doctor",
        patientName: user.name || "Patient",
        patientPhone: user.phone || "9999999999",
      });
      addToast("Appointment booked successfully!", "success");
      setCompleted(true);
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.error || "Failed to book appointment",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setCompleted(false);
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedSlot("");
    setConsultationType("video");
  };

  if (completed) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <Card glass padding="lg">
          <BookingSuccess
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedSlot}
            onViewAppointments={() => navigate("/appointments")}
            onBookAnother={resetBooking}
          />
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-3xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-health-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white">
          Book an appointment
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Schedule your visit in a few simple steps
        </p>
      </div>

      <Card glass padding="lg">
        <BookingStepper
          currentStep={step}
          onStepClick={(s) => s < step && setStep(s)}
        />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...slide}>
              <CardHeader
                title="Select a doctor"
                subtitle="Choose the specialist for your visit"
              />
              <DoctorSelector
                doctors={doctors.filter((d) => d.is_active !== false)}
                selectedDoctor={selectedDoctor}
                onSelect={setSelectedDoctor}
                loading={doctorsLoading}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...slide}>
              <CardHeader
                title="Select a date"
                subtitle={
                  selectedDoctor
                    ? `Booking with ${selectedDoctor.name || selectedDoctor.specialization}`
                    : "Pick your preferred visit date"
                }
              />
              <BookingCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...slide}>
              <CardHeader
                title="Select a time slot"
                subtitle={
                  selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Choose an available time"
                }
              />
              <SlotPicker
                slots={smartSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                loading={slotsLoading}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" {...slide}>
              <CardHeader
                title="Confirm appointment"
                subtitle="Review your booking details"
              />

              <div className="health-card p-5 space-y-4 mb-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="w-12 h-12 rounded-xl bg-health-100 dark:bg-health-900/40 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-health-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedDoctor?.name || selectedDoctor?.specialization}
                    </p>
                    <p className="text-sm text-health-600">
                      {selectedDoctor?.specialization}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide">Date</dt>
                    <dd className="font-medium text-slate-900 dark:text-white mt-0.5">
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide">Time</dt>
                    <dd className="font-medium text-slate-900 dark:text-white mt-0.5">
                      {selectedSlot}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span>{user.name || "Patient"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                </dl>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Consultation type
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "video", label: "Video call", icon: Video },
                    { id: "in-person", label: "In-person", icon: MapPin },
                  ].map((type) => {
                    const Icon = type.icon;
                    const active = consultationType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setConsultationType(type.id)}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-medium text-sm transition-all ${
                          active
                            ? "border-health-500 bg-health-50 dark:bg-health-950/30 text-health-700"
                            : "border-slate-200 dark:border-slate-700 hover:border-health-300"
                        }`}
                        aria-pressed={active}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
          {step > 1 ? (
            <Button variant="secondary" onClick={prevStep} icon={ArrowLeft}>
              Back
            </Button>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}

          {step < 4 ? (
            <Button
              className="sm:ml-auto flex-1 sm:flex-none"
              onClick={nextStep}
              disabled={!canProceed()}
              icon={ArrowRight}
            >
              Continue
            </Button>
          ) : (
            <Button
              className="sm:ml-auto flex-1 sm:flex-none"
              onClick={handleConfirm}
              loading={submitting}
            >
              Confirm booking
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default BookAppointment;
