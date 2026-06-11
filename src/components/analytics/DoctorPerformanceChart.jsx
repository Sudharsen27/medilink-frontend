import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import ChartCard from "./ChartCard";
import ChartResponsive from "./ChartResponsive";
import { CHART_COLORS, axisTickStyle, gridStroke, chartMargin } from "./chartTheme";

const DoctorPerformanceChart = ({ data = [], loading = false }) => {
  const chartData = data.map((d) => ({
    ...d,
    shortName: d.name?.length > 14 ? `${d.name.slice(0, 12)}…` : d.name,
  }));

  return (
    <ChartCard
      title="Doctor Performance"
      subtitle="Top providers by completed visits & rating"
      loading={loading}
      height="h-80 sm:h-96"
    >
      <ChartResponsive className="h-full min-h-[12rem]">
        <BarChart data={chartData} layout="vertical" margin={{ ...chartMargin, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={axisTickStyle} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="shortName"
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
            width={88}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-glass-lg">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{d.name}</p>
                  <p className="text-slate-500 mt-0.5">{d.specialization}</p>
                  <p className="mt-1.5 text-health-600 dark:text-health-400 font-semibold">
                    {d.completed} completed visits
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                    {Number(d.rating).toFixed(1)} ★ rating
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="completed" name="Completed visits" radius={[0, 6, 6, 0]} maxBarSize={16}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartResponsive>
    </ChartCard>
  );
};

export default DoctorPerformanceChart;
