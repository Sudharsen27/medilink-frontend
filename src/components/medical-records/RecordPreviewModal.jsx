import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import Button from "../../ui/Button";
import {
  getCategory,
  formatRecordDate,
  resolveRecordFileUrl,
  canPreviewFile,
  isImageFile,
} from "../../lib/medicalRecordUtils";

const RecordPreviewModal = ({ record, onClose }) => {
  if (!record) return null;

  const category = getCategory(record.record_type);
  const Icon = category.icon;
  const fileUrl = resolveRecordFileUrl(record.file_url);
  const previewable = fileUrl && canPreviewFile(record.file_url);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-record-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] health-card rounded-t-2xl sm:rounded-2xl shadow-2xl dark:shadow-glass-lg-dark flex flex-col overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-700/60 shrink-0">
            <div className="flex gap-3 min-w-0">
              <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${category.iconBg}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${category.chip} inline-block px-2 py-0.5 rounded-full mb-1`}>
                  {category.label}
                </p>
                <h2 id="preview-record-title" className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                  {record.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatRecordDate(record.record_date)}
                  {record.doctor_name && ` · ${record.doctor_name}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {record.description && (
            <p className="px-4 sm:px-5 py-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 shrink-0">
              {record.description}
            </p>
          )}

          <div className="flex-1 min-h-0 bg-slate-100 dark:bg-slate-950/50 overflow-auto">
            {!fileUrl ? (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-500">
                <FileText className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm">No document attached</p>
              </div>
            ) : previewable && isImageFile(record.file_url) ? (
              <img
                src={fileUrl}
                alt={record.title}
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />
            ) : previewable ? (
              <iframe
                title={record.title}
                src={fileUrl}
                className="w-full h-[min(60vh,520px)] border-0"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-500 px-6 text-center">
                <FileText className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Preview not available</p>
                <p className="text-xs mt-1">Download the file to view it on your device.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-700/60 shrink-0">
            {fileUrl && (
              <>
                <a href={fileUrl} download className="flex-1">
                  <Button variant="secondary" className="w-full" icon={Download}>
                    Download
                  </Button>
                </a>
                <a href={fileUrl} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full" icon={ExternalLink}>
                    Open in tab
                  </Button>
                </a>
              </>
            )}
            <Button variant="ghost" onClick={onClose} className="sm:w-auto">
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecordPreviewModal;
