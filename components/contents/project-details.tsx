"use client";

import Image from "next/image";
import { useState } from "react";
import { HandCoins, Maximize2, Minimize2, Users } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

type ProjectDetailsProps = {
  project: Doc<"projects">;
};

const defaultValue = {
  numberOfPeople: false,
  priceRangeMinMax: false,
};

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const [areTextsVisible, setAreTextsVisible] = useState(defaultValue);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  return (
    <div className="grid grid-cols-4 gap-3 rounded-md border p-6">
      <h3 className="col-span-full truncate font-medium">{project.title}</h3>
      {project.image && (
        <div
          className={cn(
            "group relative col-span-2 aspect-square hover:brightness-[80%]",
            {
              "col-span-full": isImageExpanded,
            },
          )}
        >
          <Image
            className="rounded-md object-cover"
            src={project.image.url}
            alt="Project image"
            fill
          />
          <Button
            className={cn(
              "absolute right-2 top-2 hidden h-6 w-6 cursor-pointer bg-transparent p-0 hover:bg-transparent group-hover:flex",
              {
                "right-3 top-3": isImageExpanded,
              },
            )}
            onClick={() => setIsImageExpanded(!isImageExpanded)}
          >
            {isImageExpanded ? (
              <Minimize2 className="h-5 w-5 shrink-0 text-white" />
            ) : (
              <Maximize2 className="h-4 w-4 shrink-0 text-white" />
            )}
          </Button>
        </div>
      )}
      {!isImageExpanded && project.description && (
        <p className="col-span-full text-sm text-muted-foreground">
          {project.description}
        </p>
      )}
      {(project.numberOfPeople ||
        (project.priceRangeMin && project.priceRangeMax)) && (
        <div className="col-span-full grid grid-cols-4 gap-x-3 gap-y-1">
          {project.numberOfPeople && (
            <div
              className="col-span-full flex cursor-pointer items-center gap-x-1"
              onClick={() =>
                setAreTextsVisible((prevState) => ({
                  ...prevState,
                  numberOfPeople: !prevState.numberOfPeople,
                }))
              }
            >
              {areTextsVisible.numberOfPeople ? (
                <span className="text-nowrap text-sm font-medium text-via">
                  Number of people on the project:
                </span>
              ) : (
                <Users className="h-4 w-4 shrink-0 text-via" />
              )}
              <span className="truncate text-sm">{project.numberOfPeople}</span>
            </div>
          )}
          {project.priceRangeMin && project.priceRangeMax && (
            <div
              className="col-span-full flex cursor-pointer items-center gap-x-1"
              onClick={() =>
                setAreTextsVisible((prevState) => ({
                  ...prevState,
                  priceRangeMinMax: !prevState.priceRangeMinMax,
                }))
              }
            >
              {areTextsVisible.priceRangeMinMax ? (
                <span className="text-nowrap text-sm font-medium text-via">
                  Price range:
                </span>
              ) : (
                <HandCoins className="h-4 w-4 shrink-0 text-via" />
              )}
              <span className="truncate text-sm">
                {formatCurrency(project.priceRangeMin)} -{" "}
                {formatCurrency(project.priceRangeMax)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
