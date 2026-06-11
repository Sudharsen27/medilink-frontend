import React from "react";
import {
  LineChart,
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
import { axisTickStyle, gridStroke, chartMargin } from "./chartTheme";

const PatientGrowthChart = ({ data = [], loading = false }) => (
  <ChartCard
    title="Patient Growth"
    subtitle="New registrations over the last 6 months"
    loading={loading}
  >
    <ChartResponsive className="h-full min-h-[12rem]">
      <LineChart data={data} margin={chartMargin}>
        <defs>
          <linearGradient id="patientGrowthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={axisTickStyle} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Line
          type="monotone"
          dataKey="newPatients"
          name="New patients"
          stroke="#14b8a6"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#14b8a6", strokeWidth: 0 }}
          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="cumulative"
          name="Cumulative"
          stroke="#6366f1"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
        />
      </LineChart>
    </ChartResponsive>
  </ChartCard>
);

export default PatientGrowthChart;
