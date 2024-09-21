"use client";

import { ResponsiveRadialBar } from "@nivo/radial-bar";

import { Doc } from "@/convex/_generated/dataModel";
import { useThemeStore } from "@/stores/use-theme-store";

type ListingsEducationLevelInfoChartProps = {
  data: {
    id: Doc<"jobs">["experienceLevel"];
    data: { x: Doc<"jobs">["jobSector"]; y: number }[];
  }[];
};

export default function ListingsEducationLevelInfoChart({
  data,
}: ListingsEducationLevelInfoChartProps) {
  const { theme: resolvedTheme } = useThemeStore();

  return (
    <ResponsiveRadialBar
      data={data}
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
          text: {
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "inherit",
          },
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
      margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
      padding={0.3}
      colors={{ scheme: "spectral" }}
      enableTracks={false}
      cornerRadius={2}
    />
  );
}
