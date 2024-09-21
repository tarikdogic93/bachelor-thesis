"use client";

import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  Minus,
  Plus,
  Undo,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type GeoChartControlsProps = {
  handleRotation: (direction: "right" | "left" | "up" | "down") => void;
  handleScaling: (direction: "out" | "in") => void;
  handleReset: () => void;
};

export default function GeoChartControls({
  handleRotation,
  handleScaling,
  handleReset,
}: GeoChartControlsProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-6">
      <div className="flex flex-col items-center rounded-full border border-dashed p-1">
        <Button
          className="h-8 w-8 rounded-full"
          variant="secondary"
          size="icon"
          onClick={() => handleRotation("up")}
        >
          <ArrowBigUp className="h-6 w-6 shrink-0" />
        </Button>
        <div className="flex items-center gap-x-8">
          <Button
            className="h-8 w-8 rounded-full"
            variant="secondary"
            size="icon"
          >
            <ArrowBigLeft
              className="h-6 w-6 shrink-0"
              onClick={() => handleRotation("left")}
            />
          </Button>
          <Button
            className="h-8 w-8 rounded-full"
            variant="secondary"
            size="icon"
          >
            <ArrowBigRight
              className="h-6 w-6 shrink-0"
              onClick={() => handleRotation("right")}
            />
          </Button>
        </div>
        <Button
          className="h-8 w-8 rounded-full"
          variant="secondary"
          size="icon"
        >
          <ArrowBigDown
            className="h-6 w-6 shrink-0"
            onClick={() => handleRotation("down")}
          />
        </Button>
      </div>
      <div className="flex items-center gap-x-4 rounded-full border border-dashed p-1">
        <Button
          className="h-7 w-7 rounded-full"
          variant="secondary"
          size="icon"
          onClick={() => handleScaling("out")}
        >
          <Minus className="h-6 w-6 shrink-0" />
        </Button>
        <Button
          className="h-7 w-7 rounded-full"
          variant="secondary"
          size="icon"
          onClick={() => handleScaling("in")}
        >
          <Plus className="h-6 w-6 shrink-0" />
        </Button>
      </div>
      <Button
        className="h-8 w-8 rounded-full"
        variant="secondary"
        size="icon"
        onClick={() => handleReset()}
      >
        <Undo className="h-5 w-5 shrink-0" />
      </Button>
    </div>
  );
}
