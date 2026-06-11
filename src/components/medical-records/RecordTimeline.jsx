import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Download,
  Trash2,
  Calendar,
  Building2,
  User,
} from "lucide-react";
import {
  getCategory,
  formatRecordDate,
  resolveRecordFileUrl,
  canPreviewFile,
} from "../../lib/medicalRecordUtils";

const RecordTimelineItem = ({ record, onPreview, onDelete, index }) => {
  const category = getCategory(record.record_type);
  const Icon = category.icon;
  const fileUrl = resolveRecordFileUrl(record.file_url);
  const hasPreview = fileUrl && canPreviewFile(record.file_url);

  return (
    <motion.article
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="relative pl-8 sm:pl-10 pb-8 last:pb-0 group"
    >
      <span
        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ring-4 ring-[var(--app-bg)] ${category.dot}`}
        aria-hidden="true"
      />
      <span
        className="absolute left-[5px] top-5 bottom-0 w-px bg-slate-200 dark:bg-slate-700 group-last:hidden"
        aria-hidden="true"
      />

      <div className="health-card p-4 sm:p-5 hover:shadow-soft dark:hover:shadow-soft-dark transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${category.iconBg}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${category.chip}`}>
                {category.label}
              </span>
              {record.file_name && (
                <span className="text-[10px] text-slate-400 truncate max-w-[10rem]">
                  {record.file_name}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug">
              {record.title}
            </h3>

            {record.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {record.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {formatRecordDate(record.record_date)}
              </span>
              {record.doctor_name && (
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                  {record.doctor_name}
                </span>
              )}
              {record.hospital && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {record.hospital}
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            {fileUrl && (
              <>
                <button
                  type="button"
                  onClick={() => onPreview(record)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-health-50 dark:bg-health-950/30 text-health-700 dark:text-health-400 hover:bg-health-100 dark:hover:bg-health-950/50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {hasPreview ? "Preview" : "View"}
                </button>
                <a
                  href={fileUrl}
                  download
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </>
            )}
            <button
              type="button"
              onClick={() => onDelete(record)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              aria-label={`Delete ${record.title}`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sm:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const RecordTimeline = ({ groups, onPreview, onDelete }) => (
  <div className="space-y-8">
    {groups.map((group) => (
      <section key={group.key} aria-label={group.label}>
        <div className="sticky top-14 lg:top-0 z-10 -mx-1 px-1 py-2 mb-4 bg-[var(--app-bg)]/90 backdrop-blur-sm">
          <h2 className="text-sm font-display font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-health-500" />
            {group.label}
            <span className="text-xs font-normal text-slate-400">
              ({group.items.length})
            </span>
          </h2>
        </div>
        <div>
          {group.items.map((record, index) => (
            <RecordTimelineItem
              key={record.id}
              record={record}
              index={index}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          ))}
        </div>
      </section>
    ))}
  </div>
);

export default RecordTimeline;
