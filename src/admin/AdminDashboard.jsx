import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  Activity,
  UserPlus,
  CalendarPlus,
  FileBarChart,
  ArrowUpRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { fetchAdminAnalytics, formatINR } from "../api/adminAnalytics";
import { useToast } from "../context/ToastContext";
import Button from "../ui/Button";
import Card, { CardHeader } from "../ui/Card";
import {
  AppointmentTrendsChart,
  DoctorPerformanceChart,
  PatientGrowthChart,
  MonthlyRevenueChart,
  DepartmentUsageChart,
  HealthStatisticsChart,
} from "../components/analytics";

const KpiCard = ({ icon: Icon, label, value, sublabel, accent, delay = 0 }) => {
  const accents = {
    health: "from-health-500/15 via-health-500/5 to-transparent border-health-200/50 dark:border-health-800/40",
    blue: "from-blue-500/15 via-blue-500/5 to-transparent border-blue-200/50 dark:border-blue-800/40",
    amber: "from-amber-500/15 via-amber-500/5 to-transparent border-amber-200/50 dark:border-amber-800/40",
    violet: "from-violet-500/15 via-violet-500/5 to-transparent border-violet-200/50 dark:border-violet-800/40",
  };

  const iconColors = {
    health: "bg-health-600 text-white",
    blue: "bg-clinical-blue text-white",
    amber: "bg-amber-500 text-white",
    violet: "bg-clinical-violet text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`rounded-2xl border bg-gradient-to-br p-5 ${accents[accent]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-soft ${iconColors[accent]}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <TrendingUp className="w-3 h-3" />
          Live
        </span>
      </div>
      <p className="mt-4 text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{label}</p>
      {sublabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sublabel}</p>
      )}
    </motion.div>
  );
};

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  confirmed: "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  active: "bg-health-100 text-health-800 dark:bg-health-900/40 dark:text-health-300",
};

const QuickAction = ({ to, icon: Icon, title, description, color }) => (
  <Link
    to={to}
    className="group flex items-start gap-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 p-4 hover:border-health-300 dark:hover:border-health-700 hover:shadow-soft transition-all duration-200"
  >
    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-health-700 dark:group-hover:text-health-400 transition-colors">
        {title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
    </div>
    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-health-500 shrink-0 mt-0.5 transition-colors" />
  </Link>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-28 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
      ))}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 h-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
      <div className="h-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
      <div className="h-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const analytics = await fetchAdminAnalytics();
      setData(analytics);
    } catch (error) {
      console.error(error);
      addToast("Failed to load analytics dashboard", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    load();
  }, [load]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Unable to load dashboard data.</p>
        <Button onClick={load} icon={RefreshCw}>
          Retry
        </Button>
      </div>
    );
  }

  const {
    kpis,
    appointmentTrends,
    revenueOverview,
    departmentStats,
    doctorPerformance,
    patientGrowth,
    healthStatistics,
    recentActivity,
  } = data;

  return (
    <div className="space-y-6">
      {/* Executive header */}
      <div className="relative overflow-hidden rounded-2xl border border-health-200/40 dark:border-health-800/30 bg-gradient-to-br from-health-700 via-health-800 to-slate-900 text-white p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-health-200 text-sm font-medium mb-1">Healthcare Analytics</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              {greeting}, Admin
            </h1>
            <p className="text-health-100/80 text-sm mt-2 max-w-lg">
              Interactive insights — appointments, providers, patient growth, revenue & clinical data.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={load}
            className="!bg-white/15 !border-white/20 !text-white hover:!bg-white/25 w-full sm:w-auto"
          >
            Refresh data
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          label="Total Patients"
          value={kpis.totalPatients.toLocaleString()}
          sublabel="Registered in patient registry"
          accent="health"
          delay={0.05}
        />
        <KpiCard
          icon={Stethoscope}
          label="Total Doctors"
          value={kpis.totalDoctors.toLocaleString()}
          sublabel="Active providers"
          accent="blue"
          delay={0.1}
        />
        <KpiCard
          icon={CalendarCheck}
          label="Appointments Today"
          value={kpis.appointmentsToday.toLocaleString()}
          sublabel={`${kpis.activePipeline} in pipeline`}
          accent="amber"
          delay={0.15}
        />
        <KpiCard
          icon={IndianRupee}
          label="Revenue Overview"
          value={formatINR(kpis.revenueTotal)}
          sublabel={`${kpis.completedAppointments} completed visits`}
          accent="violet"
          delay={0.2}
        />
      </div>

      {/* Row 1: Appointment trends + Department usage */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AppointmentTrendsChart data={appointmentTrends} />
        <DepartmentUsageChart data={departmentStats} />
      </div>

      {/* Row 2: Doctor performance + Patient growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoctorPerformanceChart data={doctorPerformance} />
        <PatientGrowthChart data={patientGrowth} />
      </div>

      {/* Row 3: Revenue + Health statistics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <MonthlyRevenueChart
          data={revenueOverview}
          avgFee={kpis.avgConsultationFee}
        />
        <HealthStatisticsChart data={healthStatistics} />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-3" padding="md">
          <CardHeader
            title="Recent Activity"
            subtitle="Latest appointments & registrations"
            className="mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto sidebar-scroll pr-1">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8 col-span-full">No recent activity</p>
            ) : (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
                    {item.kind === "appointment" ? (
                      <CalendarCheck className="w-4 h-4 text-health-600" />
                    ) : (
                      <UserPlus className="w-4 h-4 text-clinical-blue" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          statusStyles[item.status] || statusStyles.pending
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card padding="md">
        <CardHeader
          title="Quick Actions"
          subtitle="Common administrative tasks"
          className="mb-4"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            to="/admin/doctors"
            icon={Stethoscope}
            title="Manage Doctors"
            description="View and update provider profiles"
            color="bg-health-100 text-health-700 dark:bg-health-900/40 dark:text-health-300"
          />
          <QuickAction
            to="/admin/appointments"
            icon={CalendarPlus}
            title="Appointments"
            description="Review and update booking status"
            color="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          />
          <QuickAction
            to="/patients"
            icon={Users}
            title="Patient Registry"
            description="Browse registered patients"
            color="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
          />
          <QuickAction
            to="/notifications"
            icon={FileBarChart}
            title="Notifications"
            description="System alerts and messages"
            color="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          />
        </div>
      </Card>

      <p className="text-xs text-slate-400 text-center pb-2 flex items-center justify-center gap-1.5">
        <Activity className="w-3.5 h-3.5" />
        Revenue is estimated from completed appointments. Configure AVG_CONSULTATION_FEE on the server.
      </p>
    </div>
  );
};

export default AdminDashboard;
