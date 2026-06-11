import React from "react";

/* ─── Primitives ─── */

export const Skeleton = ({ className = "", rounded = "rounded-xl" }) => (
  <div className={`skeleton-shimmer ${rounded} ${className}`} aria-hidden="true" />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2.5 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-3 ${i === lines - 1 ? "w-2/3" : i === 0 ? "w-full" : "w-5/6"}`}
        rounded="rounded-md"
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = "md", className = "", rounded = "rounded-xl" }) => {
  const sizes = { sm: "w-9 h-9", md: "w-11 h-11", lg: "w-14 h-14", xl: "w-16 h-16" };
  return (
    <Skeleton
      className={`${sizes[size]} shrink-0 ${className}`}
      rounded={rounded}
    />
  );
};

export const SkeletonButton = ({ className = "", size = "md" }) => {
  const sizes = { sm: "h-9 w-24", md: "h-10 w-32", lg: "h-11 w-40" };
  return <Skeleton className={`${sizes[size]} ${className}`} rounded="rounded-xl" />;
};

export const SkeletonChip = ({ className = "" }) => (
  <Skeleton className={`h-9 w-24 shrink-0 ${className}`} rounded="rounded-full" />
);

export const SkeletonScreen = ({ children, label = "Loading content", className = "" }) => (
  <div
    className={`animate-fade-in ${className}`}
    aria-busy="true"
    aria-live="polite"
    aria-label={label}
    role="status"
  >
    {children}
  </div>
);

/* ─── Dashboard ─── */

export const DashboardSkeleton = () => (
  <SkeletonScreen label="Loading dashboard" className="space-y-6">
    {/* Sticky header */}
    <div className="glass-panel border-x-0 border-t-0 rounded-none -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 sm:w-72" />
          <Skeleton className="h-4 w-32" rounded="rounded-md" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-48" rounded="rounded-xl" />
          <Skeleton className="h-10 w-10" rounded="rounded-xl" />
          <Skeleton className="h-10 w-24" rounded="rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0" rounded="rounded-xl" />
        ))}
      </div>
    </div>

    {/* Welcome card */}
    <div className="health-card overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <SkeletonAvatar size="lg" rounded="rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-28" rounded="rounded-md" />
            <Skeleton className="h-8 w-48 sm:w-64" />
            <Skeleton className="h-4 w-full max-w-sm" rounded="rounded-md" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-16 flex-1 sm:w-24" rounded="rounded-xl" />
          <Skeleton className="h-16 flex-1 sm:w-24" rounded="rounded-xl" />
        </div>
      </div>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="health-card p-4 space-y-3">
          <Skeleton className="h-4 w-16" rounded="rounded-md" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-20" rounded="rounded-md" />
        </div>
      ))}
    </div>

    {/* Quick actions */}
    <div className="health-card p-5 sm:p-6">
      <Skeleton className="h-5 w-32 mb-1" rounded="rounded-md" />
      <Skeleton className="h-3 w-48 mb-5" rounded="rounded-md" />
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-card border border-slate-200/40 dark:border-slate-700/40">
            <Skeleton className="w-10 h-10" rounded="rounded-xl" />
            <Skeleton className="h-2.5 w-12" rounded="rounded-md" />
          </div>
        ))}
      </div>
    </div>

    {/* Widget grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((col) => (
        <div key={col} className="health-card p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" rounded="rounded-md" />
              <Skeleton className="h-3 w-56" rounded="rounded-md" />
            </div>
            <SkeletonButton size="sm" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
              <Skeleton className="w-12 h-12 shrink-0" rounded="rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
                <Skeleton className="h-3 w-1/2" rounded="rounded-md" />
              </div>
              <Skeleton className="h-6 w-16" rounded="rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </SkeletonScreen>
);

/* ─── Doctors ─── */

export const DoctorGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="health-card overflow-hidden">
        <Skeleton className="h-36 sm:h-40 rounded-none" rounded="rounded-none" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-5 w-3/4" rounded="rounded-md" />
          <Skeleton className="h-4 w-1/2" rounded="rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" rounded="rounded-md" />
            <Skeleton className="h-4 w-20" rounded="rounded-md" />
          </div>
          <SkeletonText lines={2} />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 flex-1" rounded="rounded-xl" />
            <Skeleton className="h-10 flex-1" rounded="rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const DoctorsPageSkeleton = () => (
  <SkeletonScreen label="Loading doctors" className="space-y-6">
    {/* Hero */}
    <div className="space-y-3">
      <Skeleton className="h-3 w-20" rounded="rounded-md" />
      <Skeleton className="h-9 w-64 sm:w-80" />
      <Skeleton className="h-4 w-full max-w-xl" rounded="rounded-md" />
    </div>

    {/* Search + filters card */}
    <div className="health-card glass-panel p-5 sm:p-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="h-11 flex-1" rounded="rounded-xl" />
        <Skeleton className="h-11 w-28 lg:hidden" rounded="rounded-xl" />
      </div>
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonChip key={i} className={i % 2 === 0 ? "w-28" : "w-24"} />
        ))}
      </div>
      <div className="hidden lg:grid grid-cols-4 gap-4 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" rounded="rounded-md" />
            <Skeleton className="h-10 w-full" rounded="rounded-xl" />
          </div>
        ))}
      </div>
    </div>

    <DoctorGridSkeleton count={6} />
  </SkeletonScreen>
);

/* ─── Appointments ─── */

export const AppointmentsSkeleton = () => (
  <SkeletonScreen label="Loading appointments" className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-64" rounded="rounded-md" />
      </div>
      <div className="flex gap-3">
        <SkeletonButton size="md" className="w-28" />
        <SkeletonButton size="lg" className="!w-44" />
      </div>
    </div>

    <div className="health-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-4 w-24" rounded="rounded-md" />
        <Skeleton className="h-10 w-44" rounded="rounded-xl" />
        <Skeleton className="h-4 w-48" rounded="rounded-md" />
      </div>
    </div>

    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="health-card p-5 sm:p-6 space-y-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4 flex-1">
              <Skeleton className="w-14 h-14 shrink-0" rounded="rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3 max-w-xs" rounded="rounded-md" />
                <Skeleton className="h-4 w-1/2" rounded="rounded-md" />
                <Skeleton className="h-3 w-40" rounded="rounded-md" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" rounded="rounded-full" />
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <Skeleton className="h-9 w-24" rounded="rounded-lg" />
            <Skeleton className="h-9 w-28" rounded="rounded-lg" />
            <Skeleton className="h-9 w-20" rounded="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonScreen>
);

/* ─── Medical Records ─── */

export const MedicalRecordsSkeleton = () => (
  <SkeletonScreen label="Loading medical records" className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-3 w-28" rounded="rounded-md" />
      <Skeleton className="h-10 w-56 sm:w-72" />
      <Skeleton className="h-4 w-72 max-w-full" rounded="rounded-md" />
    </div>

    <Skeleton className="h-11 w-full sm:w-40" rounded="rounded-xl" />

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="health-card p-4 space-y-2">
          <Skeleton className="h-8 w-12" rounded="rounded-md" />
          <Skeleton className="h-3 w-20" rounded="rounded-md" />
        </div>
      ))}
    </div>

    <div className="health-card p-4 sm:p-5 space-y-4">
      <Skeleton className="h-10 w-full" rounded="rounded-xl" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0" rounded="rounded-full" />
        ))}
      </div>
    </div>

    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" rounded="rounded-md" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative pl-10 pb-6">
            <Skeleton className="absolute left-0 top-2 w-3 h-3" rounded="rounded-full" />
            <div className="health-card p-4 sm:p-5 space-y-3">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 shrink-0" rounded="rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" rounded="rounded-full" />
                  <Skeleton className="h-5 w-3/4" rounded="rounded-md" />
                  <SkeletonText lines={2} />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" rounded="rounded-xl" />
                <Skeleton className="h-9 flex-1" rounded="rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonScreen>
);

/* ─── Notifications ─── */

export const NotificationRowSkeleton = () => (
  <div className="flex gap-4 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
    <SkeletonAvatar size="md" className="rounded-2xl" />
    <div className="flex-1 space-y-2.5 min-w-0">
      <div className="flex justify-between gap-2">
        <Skeleton className="h-4 w-2/3 max-w-[12rem]" rounded="rounded-md" />
        <Skeleton className="h-3 w-12 shrink-0" rounded="rounded-md" />
      </div>
      <Skeleton className="h-3 w-full" rounded="rounded-md" />
      <Skeleton className="h-3 w-4/5" rounded="rounded-md" />
    </div>
  </div>
);

export const NotificationsSkeleton = () => (
  <SkeletonScreen label="Loading notifications" className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-14" rounded="rounded-md" />
        <Skeleton className="h-8 w-52 sm:w-64" />
        <Skeleton className="h-4 w-40" rounded="rounded-md" />
      </div>
      <SkeletonButton className="w-full sm:w-36" />
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="health-card p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10" rounded="rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-8" />
              <Skeleton className="h-3 w-16" rounded="rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Search */}
    <Skeleton className="h-11 w-full" rounded="rounded-xl" />

    {/* Category chips */}
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonChip key={i} />
      ))}
    </div>

    {/* Read filter */}
    <div className="flex gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 w-full sm:w-72">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-9 flex-1" rounded="rounded-lg" />
      ))}
    </div>

    {/* List */}
    <div className="health-card overflow-hidden !p-0">
      <div className="px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-900/50">
        <Skeleton className="h-3 w-16" rounded="rounded-md" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <NotificationRowSkeleton key={i} />
      ))}
    </div>
  </SkeletonScreen>
);

export const NotificationLoadMoreSkeleton = () => (
  <div className="py-4 space-y-0 border-t border-slate-100 dark:border-slate-800/80" aria-hidden="true">
    {Array.from({ length: 2 }).map((_, i) => (
      <NotificationRowSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
