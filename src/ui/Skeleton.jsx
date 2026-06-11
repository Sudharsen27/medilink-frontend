import React from "react";

export const Skeleton = ({ className = "", rounded = "rounded-xl" }) => (
  <div
    className={`skeleton-shimmer ${rounded} ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        rounded="rounded-md"
      />
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-fade-in" aria-busy="true" aria-label="Loading dashboard">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" rounded="rounded-md" />
      </div>
      <Skeleton className="h-10 w-48" rounded="rounded-xl" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-28" />
      ))}
    </div>

    <Skeleton className="h-40" />

    <div className="health-card p-6 space-y-4">
      <Skeleton className="h-6 w-48" rounded="rounded-md" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
            <Skeleton className="h-3 w-1/2" rounded="rounded-md" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
