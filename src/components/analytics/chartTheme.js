import { chartSeries, chartGradients, palette } from "../../design-system/tokens";

/** @deprecated Use chartSeries from design-system/tokens */
export const CHART_COLORS = chartSeries;

export const CHART_GRADIENTS = chartGradients;

export const axisTickStyle = { fontSize: 11, fill: palette.slate[400] };

export const gridStroke = "rgba(148,163,184,0.2)";

export const chartMargin = { top: 8, right: 12, left: -8, bottom: 0 };
