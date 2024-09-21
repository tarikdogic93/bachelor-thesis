"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import PersonalInfoImage from "@/components/contents/personal-info-image";
import PersonalInfoItems from "@/components/contents/personal-info-items";

export default function PersonalInfoContent() {
  const currentUser = useQuery(api.users.currentUser);

  return (
    <div className="flex w-[318px] flex-col items-center justify-center gap-y-6 sm:w-[550px] sm:flex-row sm:gap-x-10">
      {currentUser ? (
        <>
          <div className="sm:pl-6">
            <PersonalInfoImage user={currentUser} />
          </div>
          <PersonalInfoItems user={currentUser} />
        </>
      ) : currentUser === undefined ? (
        <Spinner type="circular" size="icon" />
      ) : null}
    </div>
  );
}
