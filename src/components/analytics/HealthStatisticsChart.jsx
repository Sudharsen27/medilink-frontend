import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "./ChartCard";
import ChartResponsive from "./ChartResponsive";
import ChartTooltip from "./ChartTooltip";

const HealthStatisticsChart = ({ data = [], loading = false }) => (
  <ChartCard
    title="Health Statistics"
    subtitle="Platform health data — records, prescriptions & vitals"
    loading={loading}
    height="h-80 sm:h-96"
  >
    <ChartResponsive className="h-full min-h-[12rem]">
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="rgba(148,163,184,0.25)" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, "auto"]}
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          axisLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 4 }} iconType="circle" iconSize={8} />
        <Radar
          name="This month"
          dataKey="current"
          stroke="#0d9488"
          fill="#0d9488"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Radar
          name="Last month"
          dataKey="previous"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.15}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </RadarChart>
    </ChartResponsive>
  </ChartCard>
);

export default HealthStatisticsChart;
