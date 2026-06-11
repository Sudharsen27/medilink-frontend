import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  CalendarClock,
  Stethoscope,
  CheckCheck,
  Trash2,
  Inbox,
} from "lucide-react";
import {
  NotificationsSkeleton,
  NotificationLoadMoreSkeleton,
} from "../../ui/Skeleton";
import PageContainer from "../../ui/PageContainer";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import SearchInput from "../../ui/SearchInput";
import EmptyState from "../../ui/EmptyState";
import { useEnhancedNotifications } from "../../context/EnhancedNotificationsContext";
import { useToast } from "../../context/ToastContext";
import {
  fetchNotificationsPage,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from "../../api/notifications";
import {
  NOTIFICATION_CATEGORIES,
  READ_FILTERS,
  getNotificationMeta,
  formatNotificationTime,
  groupNotificationsByDate,
  getCategoryTypes,
  isNotificationUnread,
} from "../../lib/notificationUtils";

const PAGE_SIZE = 12;

const StatCard = ({ icon: Icon, label, value, accent }) => {
  const accents = {
    health: "from-health-500/10 to-health-600/5 text-health-700 dark:text-health-300",
    rose: "from-rose-500/10 to-rose-600/5 text-rose-700 dark:text-rose-300",
    amber: "from-amber-500/10 to-amber-600/5 text-amber-700 dark:text-amber-300",
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-gradient-to-br ${accents[accent]} p-4`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/60 flex items-center justify-center shadow-soft">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-none">
            {value}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ notification, onOpen, onMarkRead, onDelete }) => {
  const meta = getNotificationMeta(notification);
  const Icon = meta.icon;
  const unread = isNotificationUnread(notification);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className={`group relative flex gap-4 p-4 sm:p-5 transition-colors ${
        unread
          ? "bg-health-50/40 dark:bg-health-950/20"
          : "bg-white dark:bg-slate-900/40 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
      }`}
    >
      {unread && (
        <span
          className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${meta.styles.dot}`}
          aria-hidden="true"
        />
      )}

      <div
        className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${meta.styles.icon}`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {notification.title}
            </p>
            <span
              className={`inline-flex mt-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${meta.styles.border} text-slate-500 dark:text-slate-400`}
            >
              {meta.label}
            </span>
          </div>
          <time
            className="text-xs text-slate-400 dark:text-slate-500 shrink-0"
            dateTime={notification.created_at}
          >
            {formatNotificationTime(notification.created_at)}
          </time>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </button>

      <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        {unread && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="p-2 rounded-lg text-health-600 hover:bg-health-50 dark:hover:bg-health-950/40 transition-colors"
            title="Mark as read"
            aria-label="Mark as read"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          className="p-2 rounded-lg text-slate-400 hover:text-clinical-rose hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Delete"
          aria-label="Delete notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { refreshNotifications, unreadCount: globalUnread } = useEnhancedNotifications();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  const loadMoreRef = useRef(null);
  const requestIdRef = useRef(0);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPage = useCallback(
    async (pageNum, append = false) => {
      if (fetchingRef.current) return;

      const requestId = ++requestIdRef.current;
      fetchingRef.current = true;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const result = await fetchNotificationsPage({
          page: pageNum,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          types: getCategoryTypes(category),
          read: readFilter,
        });

        if (requestId !== requestIdRef.current) return;

        setTotal(result.total);
        setHasMore(result.hasMore);
        setPage(result.page);
        setItems((prev) =>
          append ? [...prev, ...result.data] : result.data
        );
      } catch (error) {
        console.error(error);
        addToast("Failed to load notifications", "error");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
          fetchingRef.current = false;
        }
      }
    },
    [debouncedSearch, category, readFilter, addToast]
  );

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadPage(page + 1, true);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, loadPage]);

  const stats = useMemo(() => {
    const appointments = items.filter((n) =>
      ["appointment", "reminder"].includes(n.type)
    ).length;
    const medical = items.filter((n) =>
      ["medical", "medical_record", "emergency"].includes(n.type)
    ).length;
    return { appointments, medical };
  }, [items]);

  const grouped = useMemo(() => groupNotificationsByDate(items), [items]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      refreshNotifications();
    } catch {
      addToast("Could not mark as read", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshNotifications();
      addToast("All notifications marked as read", "success");
    } catch {
      addToast("Could not mark all as read", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationById(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      refreshNotifications();
    } catch {
      addToast("Could not delete notification", "error");
    }
  };

  const handleOpen = (notification) => {
    if (isNotificationUnread(notification)) {
      handleMarkRead(notification.id);
    }
    const meta = getNotificationMeta(notification);
    navigate(meta.route(notification));
  };

  if (loading && items.length === 0) {
    return (
      <PageContainer maxWidth="max-w-3xl">
        <NotificationsSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-3xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-health-600 dark:text-health-400 mb-1">
              Inbox
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              Notification Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {globalUnread > 0
                ? `${globalUnread} unread · ${total} shown`
                : `${total} notifications — you're all caught up`}
            </p>
          </div>

          {globalUnread > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAllRead}
              className="w-full sm:w-auto"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <StatCard
          icon={Bell}
          label="Unread"
          value={globalUnread}
          accent="health"
        />
        <StatCard
          icon={CalendarClock}
          label="Appointments"
          value={stats.appointments}
          accent="amber"
        />
        <StatCard
          icon={Stethoscope}
          label="Medical alerts"
          value={stats.medical}
          accent="rose"
        />
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchInput
          placeholder="Search notifications..."
          onSearch={setSearch}
          className="w-full"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none -mx-1 px-1">
        {NOTIFICATION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              category === cat.id
                ? "bg-health-600 text-white shadow-soft"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60 hover:border-health-300 dark:hover:border-health-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Read filter */}
      <div className="flex gap-1 p-1 mb-5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 w-full sm:w-fit">
        {READ_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setReadFilter(filter.id)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              readFilter === filter.id
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-soft"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* List */}
      <Card className="overflow-hidden !p-0 border-slate-200/80 dark:border-slate-700/60">
        {items.length === 0 ? (
          <EmptyState
            icon={debouncedSearch || category !== "all" || readFilter !== "all" ? BellOff : Inbox}
            title={
              debouncedSearch || category !== "all" || readFilter !== "all"
                ? "No matching notifications"
                : "Your inbox is empty"
            }
            description={
              debouncedSearch || category !== "all" || readFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Appointment reminders and medical alerts will appear here."
            }
          />
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {grouped.map((group) => (
                <div key={group.label}>
                  <div className="sticky top-0 z-10 px-4 py-2.5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {group.label}
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {group.items.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onOpen={handleOpen}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </AnimatePresence>

            <div ref={loadMoreRef} className="w-full py-4">
              {loadingMore && <NotificationLoadMoreSkeleton />}
              {!hasMore && items.length > 0 && !loadingMore && (
                <p className="text-xs text-slate-400 text-center py-2">End of notifications</p>
              )}
            </div>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default NotificationCenter;
