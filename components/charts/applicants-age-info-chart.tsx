"use client";

import { ResponsiveBar } from "@nivo/bar";

import { useThemeStore } from "@/stores/use-theme-store";

type ApplicantsAgeInfoChartProps = {
  data: { range: "18-29" | "30-39" | "40-49" | "50+"; count: number }[];
};

export default function ApplicantsAgeInfoChart({
  data,
}: ApplicantsAgeInfoChartProps) {
  const { theme: resolvedTheme } = useThemeStore();

  const maxCount = Math.max(...data.map((entry) => entry.count));

  return (
    <ResponsiveBar
      data={data}
      keys={["count"]}
      indexBy="range"
      layout="horizontal"
      margin={{ top: 40, right: 35, bottom: 60, left: 70 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: `var(--${resolvedTheme}-400)`,
            },
          },
          ticks: {
            line: {
              stroke: `var(--${resolvedTheme}-400)`,
            },
            text: {
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "inherit",
              fill: `var(--${resolvedTheme}-400)`,
            },
          },
          legend: {
            text: {
              fontSize: 14,
              fontWeight: "bold",
              fontFamily: "inherit",
              fill: `var(--${resolvedTheme}-400)`,
            },
          },
        },
        labels: {
          text: { fontSize: 14, fontWeight: "bold", fontFamily: "inherit" },
        },
        tooltip: {
          container: {
            color: "black",
            backgroundColor: "white",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          },
        },
      }}
      colors={{ scheme: "spectral" }}
      borderColor={{
        from: "color",
      }}
      borderRadius={4}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count",
        legendPosition: "end",
        legendOffset: 40,
        truncateTickAt: 0,
        tickValues: Array.from({ length: maxCount + 1 }, (_, i) => i),
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Ages",
        legendPosition: "end",
        legendOffset: -45,
        truncateTickAt: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 4]],
      }}
      enableGridY={false}
      tooltipLabel={({ indexValue }) => `Ages ${indexValue}`}
    />
  );
}
