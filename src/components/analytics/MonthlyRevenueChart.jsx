import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "./ChartCard";
import ChartResponsive from "./ChartResponsive";
import ChartTooltip from "./ChartTooltip";
import { formatINR } from "../../api/adminAnalytics";
import { axisTickStyle, gridStroke, chartMargin } from "./chartTheme";

const MonthlyRevenueChart = ({ data = [], avgFee, loading = false }) => (
  <ChartCard
    title="Monthly Revenue"
    subtitle={
      avgFee
        ? `Estimated from completed visits @ ${formatINR(avgFee)} avg.`
        : "Estimated from completed visits"
    }
    loading={loading}
    colSpan="xl:col-span-2"
  >
    <ChartResponsive className="h-full min-h-[12rem]">
      <ComposedChart data={data} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          allowDecimals={false}
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip content={<ChartTooltip valueFormatter={(v, e) => (e?.dataKey === "revenue" ? formatINR(v) : v)} />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={36} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="#0d9488"
          strokeWidth={2}
          dot={{ r: 3, fill: "#0d9488" }}
        />
      </ComposedChart>
    </ChartResponsive>
  </ChartCard>
);

export default MonthlyRevenueChart;
