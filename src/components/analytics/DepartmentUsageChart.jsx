import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";
import ChartResponsive from "./ChartResponsive";
import { CHART_COLORS } from "./chartTheme";

const DepartmentUsageChart = ({ data = [], loading = false }) => {
  const chartData = useMemo(() => {
    if (!data?.length) return [{ name: "General Practice", value: 1, doctors: 0, appointments: 0 }];
    return data.map((d) => ({
      name: d.department,
      value: d.appointments || d.doctors || 1,
      doctors: d.doctors,
      appointments: d.appointments,
    }));
  }, [data]);

  return (
    <ChartCard
      title="Department Usage"
      subtitle="Appointments by medical specialization"
      loading={loading}
    >
      <ChartResponsive className="h-52 sm:h-56">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="78%"
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-glass-lg">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                    <p className="text-slate-500 mt-1">{item.appointments} appointments</p>
                    <p className="text-slate-500">{item.doctors} doctors</p>
                  </div>
                );
              }}
            />
          </PieChart>
      </ChartResponsive>
      <div className="px-2 pb-2 space-y-2 max-h-32 overflow-y-auto sidebar-scroll">
        {data.map((dept, i) => (
          <div key={dept.department} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              {dept.department}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0 ml-2 tabular-nums">
              {dept.appointments}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default DepartmentUsageChart;
