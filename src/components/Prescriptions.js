import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Pill,
  Stethoscope,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
} from "lucide-react";
import { fetchPrescriptions, fetchPrescriptionById } from "../api/prescriptions";
import PageContainer from "../ui/PageContainer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Eyebrow, Heading } from "../ui/Typography";
import { SkeletonScreen, Skeleton } from "../ui/Skeleton";

const displayDoctor = (name) =>
  name?.trim().startsWith("Dr.") ? name.trim() : `Dr. ${name || "Physician"}`;

const statusVariant = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "active") return "success";
  if (s === "expired" || s === "cancelled") return "danger";
  return "default";
};

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
      setError("Could not load prescriptions. Make sure you are logged in.");
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const toggleDetails = async (prescription) => {
    if (expandedId === prescription.id) {
      setExpandedId(null);
      return;
    }
    setDetailLoading(true);
    try {
      await fetchPrescriptionById(prescription.id);
      setExpandedId(prescription.id);
    } catch {
      setExpandedId(prescription.id);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer maxWidth="max-w-4xl">
        <SkeletonScreen label="Loading prescriptions" className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" rounded="rounded-2xl" />
          <Skeleton className="h-40 w-full" rounded="rounded-2xl" />
        </SkeletonScreen>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <Eyebrow>Pharmacy</Eyebrow>
          <Heading level={1} className="mt-1">
            My Prescriptions
          </Heading>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Active medications and instructions from your doctors.
          </p>
        </div>
        <Badge variant="default" size="sm">
          {prescriptions.length} visit{prescriptions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {error && (
        <Card padding="sm" className="!p-4 mb-4 border-rose-200 dark:border-rose-900/40">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        </Card>
      )}

      {prescriptions.length === 0 ? (
        <Card padding="lg" className="text-center !py-14">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-health-50 dark:bg-health-950/30 flex items-center justify-center">
            <Pill className="w-7 h-7 text-health-600 dark:text-health-400" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">
            No prescriptions yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            After a consultation, your doctor&apos;s prescriptions will appear here with dosage and instructions.
          </p>
          <Link to="/telemedicine">
            <Button variant="primary">Book a consultation</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} padding="md" className="!p-0 overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-health-50 dark:bg-health-950/40 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-health-600 dark:text-health-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {displayDoctor(rx.doctor_name)}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {rx.doctor_specialization}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(rx.created_at).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(rx.status)} size="sm" className="w-fit capitalize">
                    {rx.status || "active"}
                  </Badge>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Medications ({rx.medications?.length || 0})
                </p>
                {(rx.medications || []).map((med, i) => (
                  <div
                    key={`${rx.id}-${i}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Pill className="w-4 h-4 text-health-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {med.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {med.dosage} · {med.frequency}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                      {med.duration}
                    </span>
                  </div>
                ))}

                {rx.instructions && (
                  <div className="p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      Instructions
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">
                      {rx.instructions}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 sm:px-6 py-4 bg-slate-50/80 dark:bg-slate-900/40 flex flex-wrap gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={expandedId === rx.id ? ChevronUp : ChevronDown}
                  onClick={() => toggleDetails(rx)}
                  disabled={detailLoading}
                >
                  {expandedId === rx.id ? "Hide details" : "Details"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={Download}
                  onClick={() => window.alert(`PDF download for prescription #${rx.id} coming soon`)}
                >
                  Download
                </Button>
              </div>

              {expandedId === rx.id && (
                <div className="px-5 sm:px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p>
                    <span className="font-medium text-slate-800 dark:text-slate-200">Doctor:</span>{" "}
                    {displayDoctor(rx.doctor_name)}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800 dark:text-slate-200">Issued:</span>{" "}
                    {new Date(rx.created_at).toLocaleDateString()}
                  </p>
                  {rx.follow_up_date && (
                    <p>
                      <span className="font-medium text-slate-800 dark:text-slate-200">Valid until:</span>{" "}
                      {new Date(rx.follow_up_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Prescriptions;
