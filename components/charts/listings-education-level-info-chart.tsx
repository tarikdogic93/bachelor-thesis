"use client";

import { useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ResponsiveRadar } from "@nivo/radar";

import { Doc } from "@/convex/_generated/dataModel";
import { useThemeStore } from "@/stores/use-theme-store";

type DataItemType = {
  educationLevel: Doc<"jobs">["educationLevel"];
} & Record<Doc<"jobs">["jobSector"], number>;

type ListingsEducationLevelInfoChartProps = {
  data: DataItemType[];
};

const educationLevelAbbreviations: Record<
  Doc<"jobs">["educationLevel"],
  string
> = {
  "High school diploma": "HS",
  "Associate degree": "AS",
  "Bachelor's degree": "BS",
  "Master's degree": "MS",
  PhD: "PhD",
};

export default function ListingsEducationLevelInfoChart({
  data,
}: ListingsEducationLevelInfoChartProps) {
  const { theme: resolvedTheme } = useThemeStore();
  const matchesXlMediaQuery = useMediaQuery("(min-width: 1280px)");

  const dataWithAbbreviatedEducationLevels = useMemo(() => {
    return data.map((item) => ({
      educationLevel: educationLevelAbbreviations[item.educationLevel],
      ...Object.fromEntries(
        Object.entries(item).filter(([key]) => key !== "educationLevel"),
      ),
    }));
  }, [data]);

  return (
    <ResponsiveRadar
      data={matchesXlMediaQuery ? data : dataWithAbbreviatedEducationLevels}
      keys={[
        "Web development",
        "Mobile development",
        "Artificial intelligence",
        "DevOps engineering",
        "Cloud computing",
        "Other",
      ]}
      indexBy="educationLevel"
      margin={{ top: 40, right: 0, bottom: 40, left: 0 }}
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
          wrapper: {
            zIndex: 99999,
          },
          container: {
            color: "black",
            backgroundColor: "white",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          },
        },
      }}
      colors={{ scheme: "spectral" }}
      borderColor={{ from: "color" }}
      gridLabelOffset={12}
      gridShape="linear"
      dotSize={8}
    />
  );
}
