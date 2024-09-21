"use client";

import { useMediaQuery } from "usehooks-ts";
import { ResponsivePie } from "@nivo/pie";

import { Doc } from "@/convex/_generated/dataModel";

type ListingsSettingTypeInfoChartProps = {
  data: {
    id: Doc<"jobs">["settingType"];
    label: string;
    value: number;
  }[];
};

export default function ListingsSettingTypeInfoChart({
  data,
}: ListingsSettingTypeInfoChartProps) {
  const matchesXlMediaQuery = useMediaQuery("(min-width: 1280px)");

  return (
    <ResponsivePie
      data={data}
      sortByValue
      theme={{
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
      margin={{ top: 40, right: 0, bottom: 40, left: 0 }}
      innerRadius={0.5}
      padAngle={1.5}
      cornerRadius={4}
      activeOuterRadiusOffset={7}
      borderWidth={1}
      borderColor={{
        from: "color",
      }}
      enableArcLinkLabels={matchesXlMediaQuery}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={{ from: "color" }}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 4]],
      }}
    />
  );
}
