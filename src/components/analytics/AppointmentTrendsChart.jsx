import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "./ChartCard";
import ChartResponsive from "./ChartResponsive";
import ChartTooltip from "./ChartTooltip";
import { axisTickStyle, gridStroke, chartMargin } from "./chartTheme";

const AppointmentTrendsChart = ({ data = [], loading = false }) => (
  <ChartCard
    title="Appointment Trends"
    subtitle="Last 14 days — bookings, completions & cancellations"
    loading={loading}
    colSpan="xl:col-span-2"
  >
    <ChartResponsive className="h-full min-h-[12rem]">
      <AreaChart data={data} margin={chartMargin}>
        <defs>
          <linearGradient id="aptTotalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="aptCompletedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="aptCancelledGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="label" tick={axisTickStyle} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis allowDecimals={false} tick={axisTickStyle} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Area type="monotone" dataKey="total" name="Total" stroke="#0d9488" strokeWidth={2} fill="url(#aptTotalGrad)" activeDot={{ r: 5 }} />
        <Area type="monotone" dataKey="completed" name="Completed" stroke="#3b82f6" strokeWidth={2} fill="url(#aptCompletedGrad)" activeDot={{ r: 5 }} />
        <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="#f43f5e" strokeWidth={2} fill="url(#aptCancelledGrad)" activeDot={{ r: 5 }} />
      </AreaChart>
    </ChartResponsive>
  </ChartCard>
);

export default AppointmentTrendsChart;
