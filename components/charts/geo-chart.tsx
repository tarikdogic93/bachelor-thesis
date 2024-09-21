"use client";

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ResponsiveChoropleth } from "@nivo/geo";

import { cn } from "@/lib/utils";
import { geoChart } from "@/data/countries-data";
import useGeoChartControls from "@/hooks/use-geo-chart-controls";
import { useThemeStore } from "@/stores/use-theme-store";
import GeoChartControls from "@/components/charts/geo-chart-controls";

type GeoChartProps = {
  data: {
    id: string;
    value: number;
  }[];
};

export default function GeoChart({ data }: GeoChartProps) {
  const { theme: resolvedTheme } = useThemeStore();
  const matchesXlMediaQuery = useMediaQuery("(min-width: 1280px)");
  const {
    projectionRotation,
    projectionScale,
    isGrabbing,
    isZoomingIn,
    isZoomingOut,
    handleRotation,
    handleScaling,
    handleReset,
    handleKeyPress,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useGeoChartControls(130, [-15, -30, 0], 10, 10, 80, 1000, 0.1);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, handleReset, handleRotation, handleScaling]);

  return (
    <div className="flex h-full w-full items-center">
      <div
        className={cn("h-full w-full hover:cursor-grab", {
          "hover:cursor-grabbing": isGrabbing,
          "hover:cursor-zoom-in": isZoomingIn,
          "hover:cursor-zoom-out": isZoomingOut,
        })}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleMouseWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ResponsiveChoropleth
          data={data}
          features={geoChart.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          theme={{
            legends: {
              text: { fontSize: 12, fontWeight: "bold", fontFamily: "inherit" },
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
          colors="spectral"
          domain={[0, 1000000]}
          unknownColor={`var(--${resolvedTheme}-400)`}
          label="properties.name"
          projectionType="orthographic"
          projectionScale={projectionScale}
          projectionTranslation={[0.5, 0.5]}
          projectionRotation={projectionRotation}
          enableGraticule={true}
          graticuleLineColor={`var(--${resolvedTheme}-600)`}
          borderWidth={0.5}
          borderColor="black"
        />
      </div>
      {matchesXlMediaQuery && (
        <GeoChartControls
          handleRotation={handleRotation}
          handleScaling={handleScaling}
          handleReset={handleReset}
        />
      )}
    </div>
  );
}
