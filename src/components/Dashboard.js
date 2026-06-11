import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, LayoutDashboard, CalendarDays, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import { fetchAppointments, fetchAllAppointments } from "../api/appointments";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import DateRangePicker from "./DateRangePicker";
import ExportButton from "./ExportButton";
import NotificationBell from "./NotificationBell";
import PatientDashboard from "./PatientDashboard";
import { useNavigate } from "react-router-dom";
import PageContainer from "../ui/PageContainer";
import { DashboardSkeleton } from "../ui/Skeleton";
import Card, { CardHeader } from "../ui/Card";
import Button from "../ui/Button";

const tabConfig = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "appointments", name: "Appointments", icon: CalendarDays },
  { id: "new-appointment", name: "New Appointment", icon: Plus },
];

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { addToast } = useToast();

  const stats = useMemo(() => {
    const list = Array.isArray(appointments) ? appointments : [];
    return {
      total: list.length,
      pending: list.filter((a) => a.status === "pending").length,
      confirmed: list.filter((a) => a.status === "confirmed").length,
      cancelled: list.filter((a) => a.status === "cancelled").length,
      completed: list.filter((a) => a.status === "completed").length,
    };
  }, [appointments]);

  const loadAppointments = useCallback(
    async ({ notifySuccess = false } = {}) => {
      try {
        setLoading(true);
        const response =
          user?.role === "admin"
            ? await fetchAllAppointments()
            : await fetchAppointments();
        setAppointments(Array.isArray(response) ? response : []);
        if (notifySuccess) {
          addToast("Data refreshed successfully", "success");
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        addToast("Failed to load appointments", "error");
      } finally {
        setLoading(false);
      }
    },
    [user, addToast]
  );

  useEffect(() => {
    let result = appointments;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (appt) =>
          appt.title?.toLowerCase().includes(term) ||
          appt.userName?.toLowerCase().includes(term) ||
          appt.description?.toLowerCase().includes(term) ||
          appt.doctorName?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((appt) => appt.status === statusFilter);
    }
    if (dateRange.start && dateRange.end) {
      result = result.filter((appt) => {
        const apptDate = new Date(appt.date);
        return apptDate >= dateRange.start && apptDate <= dateRange.end;
      });
    }
    setFilteredAppointments(result);
  }, [appointments, searchTerm, statusFilter, dateRange]);

  useEffect(() => {
    loadAppointments({ notifySuccess: refreshTrigger > 0 });
  }, [loadAppointments, refreshTrigger]);

  const handleAddAppointment = useCallback(
    (newAppointment) => {
      setAppointments((prev) => [newAppointment, ...prev]);
      addToast("Appointment created successfully", "success");
    },
    [addToast]
  );

  const handleRefresh = useCallback(() => setRefreshTrigger((prev) => prev + 1), []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({ start: null, end: null });
    addToast("Filters cleared", "info");
  }, [addToast]);

  const handlePatientQuickAction = useCallback(
    (actionId) => {
      switch (actionId) {
        case "book":
          setActiveTab("new-appointment");
          break;
        case "records":
          navigate("/medical-records");
          break;
        case "telemedicine":
          navigate("/telemedicine");
          break;
        case "doctors":
          navigate("/doctors");
          break;
        case "emergency":
          navigate("/emergency");
          break;
        case "notifications":
          setShowNotifications(true);
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  const handleStatClick = useCallback(
    (type) => {
      setActiveTab("appointments");
      switch (type) {
        case "total":
          clearAllFilters();
          break;
        case "pending":
          setStatusFilter("pending");
          break;
        case "confirmed":
          setStatusFilter("confirmed");
          break;
        case "cancelled":
          setStatusFilter("cancelled");
          break;
        case "completed":
          setStatusFilter("completed");
          break;
        default:
          clearAllFilters();
      }
    },
    [clearAllFilters]
  );

  if (loading && appointments.length === 0) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
      {/* Dashboard header */}
      <div className="glass-panel border-x-0 border-t-0 rounded-none sticky top-14 lg:top-0 z-30">
        <PageContainer className="py-4 lg:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user.name?.split(" ")[0]}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Role:{" "}
                <span className="font-semibold text-health-600 dark:text-health-400 capitalize">
                  {user.role}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SearchBar onSearch={setSearchTerm} />
              <NotificationBell
                notifications={notifications}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                onMarkAsRead={markNotificationAsRead}
              />
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={handleRefresh}
                loading={loading}
                aria-label="Refresh data"
              >
                Refresh
              </Button>
              {user?.role === "admin" && (
                <Button
                  size="sm"
                  onClick={() => {
                    loadAppointments();
                    navigate("/appointments");
                  }}
                  disabled={loading}
                >
                  All Appointments
                </Button>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        {/* Tabs */}
        <nav
          className="flex gap-1 p-1.5 mb-8 rounded-card-lg glass-panel"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-health-600 text-white shadow-soft"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <PatientDashboard
                user={user}
                appointments={appointments}
                stats={stats}
                onStatClick={handleStatClick}
                onViewAllAppointments={() => setActiveTab("appointments")}
                onNewAppointment={() => setActiveTab("new-appointment")}
                onQuickAction={handlePatientQuickAction}
                unreadNotifications={notifications.filter((n) => !n.read).length}
              />
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader
                  title="Appointments"
                  subtitle="Manage and track all your visits"
                  action={
                    <div className="flex flex-wrap items-center gap-3">
                      {(searchTerm || statusFilter !== "all" || dateRange.start) && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                          Clear filters
                        </Button>
                      )}
                      <ExportButton data={filteredAppointments} />
                      <span className="text-sm text-slate-500">
                        {filteredAppointments.length} of {appointments.length}
                      </span>
                    </div>
                  }
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FilterBar onFilter={setStatusFilter} currentFilter={statusFilter} />
                  <DateRangePicker onRangeChange={setDateRange} />
                  <div className="flex items-end">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={handleRefresh}
                      icon={RefreshCw}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </Card>

              <Card padding="none" className="overflow-hidden">
                <AppointmentList
                  appointments={filteredAppointments}
                  onUpdate={loadAppointments}
                  searchTerm={searchTerm}
                  loading={loading}
                />
              </Card>
            </motion.div>
          )}

          {activeTab === "new-appointment" && (
            <motion.div
              key="new-appointment"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Card>
                <CardHeader
                  title="Create Appointment"
                  subtitle="Schedule a new visit with patient details"
                  action={
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("appointments")}>
                      Back
                    </Button>
                  }
                />
                <AppointmentForm
                  onAdd={handleAddAppointment}
                  onCancel={() => setActiveTab("appointments")}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
    </div>
  );
};

export default Dashboard;
