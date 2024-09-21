"use client";

import { ResponsiveLine } from "@nivo/line";

import { useThemeStore } from "@/stores/use-theme-store";

type CompaniesEstablishmentInfoChartProps = {
  data: {
    id: "establishment";
    data: {
      x: string;
      y: number;
    }[];
  }[];
};

export default function CompaniesEstablishmentInfoChart({
  data,
}: CompaniesEstablishmentInfoChartProps) {
  const { theme: resolvedTheme } = useThemeStore();

  const maxCount = Math.max(
    ...data.flatMap((series) => series.data.map((entry) => entry.y)),
  );

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 40, right: 30, bottom: 60, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        stacked: true,
        reverse: false,
      }}
      curve="monotoneX"
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
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Establishment years",
        legendOffset: 40,
        legendPosition: "end",
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count",
        legendOffset: -40,
        legendPosition: "end",
        truncateTickAt: 0,
        tickValues: Array.from({ length: maxCount + 1 }, (_, i) => i),
      }}
      enableGridX={false}
      enableGridY={false}
      enableArea={true}
      colors={{ scheme: "spectral" }}
      pointSize={8}
      pointColor={{ from: "color", modifiers: [] }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "color", modifiers: [] }}
      enableTouchCrosshair={true}
      useMesh={true}
    />
  );
}
