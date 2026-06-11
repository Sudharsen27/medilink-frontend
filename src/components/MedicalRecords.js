import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  FolderOpen,
  Filter,
} from "lucide-react";
import { useMedicalRecords } from "../context/MedicalRecordsContext";
import { useToast } from "../context/ToastContext";
import PageContainer from "../ui/PageContainer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";
import EmptyState from "../ui/EmptyState";
import { MedicalRecordsSkeleton } from "../ui/Skeleton";
import UploadRecordModal from "./medical-records/UploadRecordModal";
import RecordPreviewModal from "./medical-records/RecordPreviewModal";
import RecordTimeline from "./medical-records/RecordTimeline";
import {
  RECORD_CATEGORIES,
  filterRecords,
  groupRecordsByPeriod,
  getCategoryCounts,
} from "../lib/medicalRecordUtils";

const CategoryChips = ({ active, onChange, counts }) => {
  const visible = ["all", ...Object.keys(RECORD_CATEGORIES).filter((k) => k !== "all" && counts[k])];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
      role="group"
      aria-label="Filter by category"
    >
      {visible.map((id) => {
        const cat = RECORD_CATEGORIES[id];
        const Icon = cat.icon;
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              selected
                ? "bg-health-600 text-white shadow-soft"
                : `${cat.chip} hover:opacity-90`
            }`}
            aria-pressed={selected}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {cat.label}
            <span className={`tabular-nums ${selected ? "text-health-100" : "opacity-70"}`}>
              {counts[id] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const DeleteRecordDialog = ({ record, onCancel, onConfirm }) => {
  if (!record) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="health-card rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        role="alertdialog"
        aria-labelledby="delete-record-title"
      >
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 id="delete-record-title" className="text-lg font-bold text-slate-900 dark:text-white text-center">
          Delete record?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-2 mb-6">
          &ldquo;{record.title}&rdquo; will be permanently removed.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const MedicalRecords = () => {
  const {
    medicalRecords,
    loading,
    fetchRecords,
    deleteMedicalRecord,
    uploadMedicalRecord,
    getRecordsStats,
  } = useMedicalRecords();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const counts = useMemo(() => getCategoryCounts(medicalRecords), [medicalRecords]);
  const stats = useMemo(() => getRecordsStats(), [getRecordsStats]);

  const filtered = useMemo(
    () => filterRecords(medicalRecords, { search, category }),
    [medicalRecords, search, category]
  );

  const timelineGroups = useMemo(
    () => groupRecordsByPeriod(filtered),
    [filtered]
  );

  const handleUpload = useCallback(
    async (formData, file) => {
      setUploading(true);
      try {
        await uploadMedicalRecord(formData, file);
        addToast("Medical record uploaded successfully", "success");
      } finally {
        setUploading(false);
      }
    },
    [uploadMedicalRecord, addToast]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMedicalRecord(deleteTarget.id);
    setDeleteTarget(null);
    addToast("Record deleted", "info");
  }, [deleteTarget, deleteMedicalRecord, addToast]);

  if (loading) {
    return (
      <PageContainer>
        <MedicalRecordsSkeleton />
      </PageContainer>
    );
  }

  const hasRecords = medicalRecords.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <PageContainer maxWidth="max-w-4xl" className="pb-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-health-600 dark:text-health-400 mb-1">
              Health documents
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              Medical Records
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
              Secure timeline of lab results, imaging, prescriptions, and clinical notes.
            </p>
          </div>
          <Button
            icon={Plus}
            onClick={() => setShowUpload(true)}
            className="w-full sm:w-auto shrink-0"
          >
            Upload record
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      {hasRecords && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <Card padding="sm" className="!p-4">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
              {stats.total}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total documents</p>
          </Card>
          <Card padding="sm" className="!p-4">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
              {Object.keys(stats.byType || {}).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Categories</p>
          </Card>
          <Card padding="sm" className="!p-4 col-span-2 sm:col-span-1">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
              {filtered.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Showing now</p>
          </Card>
        </div>
      )}

      {/* Search & filters */}
      {hasRecords && (
        <Card glass padding="md" className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <SearchInput
              placeholder="Search records, doctors, hospitals…"
              onSearch={setSearch}
              className="flex-1 w-full"
            />
            {(search || category !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                icon={Filter}
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="shrink-0"
              >
                Clear filters
              </Button>
            )}
          </div>
          <CategoryChips active={category} onChange={setCategory} counts={counts} />
        </Card>
      )}

      {/* Content */}
      {!hasRecords ? (
        <Card padding="none" className="overflow-hidden">
          <EmptyState
            icon={FolderOpen}
            title="No medical records yet"
            description="Upload lab reports, imaging results, prescriptions, and other health documents to build your clinical timeline."
            actionLabel="Upload your first record"
            onAction={() => setShowUpload(true)}
          />
        </Card>
      ) : !hasResults ? (
        <Card padding="md">
          <EmptyState
            icon={FileText}
            title="No matching records"
            description="Try a different search term or category filter."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch("");
              setCategory("all");
            }}
          />
        </Card>
      ) : (
        <RecordTimeline
          groups={timelineGroups}
          onPreview={setPreviewRecord}
          onDelete={setDeleteTarget}
        />
      )}

      <UploadRecordModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSubmit={handleUpload}
        uploading={uploading}
      />

      <RecordPreviewModal
        record={previewRecord}
        onClose={() => setPreviewRecord(null)}
      />

      <DeleteRecordDialog
        record={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
};

export default MedicalRecords;
