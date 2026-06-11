import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileUp } from "lucide-react";
import Button from "../../ui/Button";
import { UPLOAD_CATEGORIES } from "../../lib/medicalRecordUtils";

const defaultForm = () => ({
  record_type: "lab_report",
  title: "",
  description: "",
  record_date: new Date().toISOString().split("T")[0],
  doctor_name: "",
  hospital: "",
});

const UploadRecordModal = ({ open, onClose, onSubmit, uploading = false }) => {
  const [formData, setFormData] = useState(() => defaultForm());
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setFormData(defaultForm());
    setFile(null);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please attach a document to upload.");
      return;
    }
    if (!formData.title?.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.description?.trim()) {
      setError("Description is required.");
      return;
    }
    try {
      setError("");
      await onSubmit(formData, file);
      reset();
      onClose();
    } catch {
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-record-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="fixed inset-x-4 top-[5vh] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-auto sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto health-card rounded-2xl shadow-2xl dark:shadow-glass-lg-dark"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-5 border-b border-slate-200/80 dark:border-slate-700/60 bg-[var(--surface-base)] rounded-t-2xl">
              <div>
                <h2 id="upload-record-title" className="text-lg font-display font-bold text-slate-900 dark:text-white">
                  Upload record
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add lab results, imaging, or clinical documents
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  className="health-input"
                  value={formData.record_type}
                  onChange={(e) => setFormData({ ...formData, record_type: e.target.value })}
                >
                  {UPLOAD_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Title
                </label>
                <input
                  className="health-input"
                  placeholder="e.g. Annual blood panel 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  className="health-input resize-none min-h-[80px]"
                  placeholder="Summary, findings, or notes…"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Record date
                  </label>
                  <input
                    type="date"
                    className="health-input"
                    value={formData.record_date}
                    onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Doctor (optional)
                  </label>
                  <input
                    className="health-input"
                    placeholder="Dr. name"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Hospital / clinic (optional)
                </label>
                <input
                  className="health-input"
                  placeholder="Facility name"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Document
                </label>
                <input
                  type="file"
                  id="medical-record-file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="medical-record-file"
                  className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                    file
                      ? "border-health-400 bg-health-50/80 dark:bg-health-950/30"
                      : "border-slate-300 dark:border-slate-600 hover:border-health-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {file ? (
                    <FileUp className="w-8 h-8 text-health-600 dark:text-health-400" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400" />
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                    {file ? file.name : "Tap to choose PDF, image, or document"}
                  </span>
                  <span className="text-xs text-slate-500">Max recommended 10 MB</span>
                </label>
              </div>

              {error && (
                <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" loading={uploading} icon={Upload}>
                  Upload record
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadRecordModal;
