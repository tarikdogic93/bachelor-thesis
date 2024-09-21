"use client";

import { useState } from "react";
import { Axis3d, Building, Building2, Earth } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

type ExperienceDetailsProps = {
  experience: Doc<"experiences">;
};

const defaultValue = {
  establishment: false,
  country: false,
  city: false,
  settingType: false,
};

export default function ExperienceDetails({
  experience,
}: ExperienceDetailsProps) {
  const [areTextsVisible, setAreTextsVisible] = useState(defaultValue);

  return (
    <div className="grid grid-cols-4 gap-3 rounded-md border p-6">
      <h3 className="col-span-full truncate font-medium">{experience.title}</h3>
      {experience.description && (
        <p className="col-span-full text-sm text-muted-foreground">
          {experience.description}
        </p>
      )}
      <div className="col-span-full grid grid-cols-4 gap-x-3 gap-y-1">
        <div
          className="col-span-full flex cursor-pointer items-center gap-x-1"
          onClick={() =>
            setAreTextsVisible((prevState) => ({
              ...prevState,
              establishment: !prevState.establishment,
            }))
          }
        >
          {areTextsVisible.establishment ? (
            <span className="text-nowrap text-sm font-medium text-via">
              Establishment:
            </span>
          ) : (
            <Building className="h-4 w-4 shrink-0 text-via" />
          )}
          <span className="truncate text-sm">{experience.establishment}</span>
        </div>
        {experience.country && (
          <div
            className="col-span-full flex cursor-pointer items-center gap-x-1"
            onClick={() =>
              setAreTextsVisible((prevState) => ({
                ...prevState,
                country: !prevState.country,
              }))
            }
          >
            {areTextsVisible.country ? (
              <span className="text-nowrap text-sm font-medium text-via">
                Country:
              </span>
            ) : (
              <Earth className="h-4 w-4 shrink-0 text-via" />
            )}
            <span className="truncate text-sm">{experience.country.name}</span>
          </div>
        )}
        {experience.city && (
          <div
            className="col-span-full flex cursor-pointer items-center gap-x-1"
            onClick={() =>
              setAreTextsVisible((prevState) => ({
                ...prevState,
                city: !prevState.city,
              }))
            }
          >
            {areTextsVisible.city ? (
              <span className="text-nowrap text-sm font-medium text-via">
                City:
              </span>
            ) : (
              <Building2 className="h-4 w-4 shrink-0 text-via" />
            )}
            <span className="truncate text-sm">{experience.city}</span>
          </div>
        )}
        <div
          className="col-span-full flex cursor-pointer items-center gap-x-1"
          onClick={() =>
            setAreTextsVisible((prevState) => ({
              ...prevState,
              settingType: !prevState.settingType,
            }))
          }
        >
          {areTextsVisible.settingType ? (
            <span className="text-nowrap text-sm font-medium text-via">
              Setting type:
            </span>
          ) : (
            <Axis3d className="h-4 w-4 shrink-0 text-via" />
          )}
          <span className="truncate text-sm">{experience.settingType}</span>
        </div>
      </div>
    </div>
  );
}
