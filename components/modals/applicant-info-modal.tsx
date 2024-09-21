"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { descriptions, titles } from "@/data/applicant-info-modal-data";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import ApplicantInfoModalOptions from "@/components/modals/applicant-info-modal-options";
import PersonalInfoItems from "@/components/contents/personal-info-items";
import SkillContent from "@/components/contents/skill-content";
import SkillDetails from "@/components/contents/skill-details";
import AchievementContent from "@/components/contents/achievement-content";
import AchievementDetails from "@/components/contents/achievement-details";
import ExperienceContent from "@/components/contents/experience-content";
import ExperienceDetails from "@/components/contents/experience-details";

export default function ApplicantInfoModal() {
  const { type, data, applicantInfoMode, setApplicantInfoMode, handleClose } =
    useModalStore();
  const [selectedSkill, setSelectedSkill] = useState<Doc<"skills"> | null>(
    null,
  );
  const [selectedAchievement, setSelectedAchievement] =
    useState<Doc<"achievements"> | null>(null);
  const [selectedExperience, setSelectedExperience] =
    useState<Doc<"experiences"> | null>(null);

  const user = data?.user;

  const title = titles[applicantInfoMode];
  const description = descriptions[applicantInfoMode];

  const contents = {
    "": <ApplicantInfoModalOptions />,
    personalInfo: <>{user && <PersonalInfoItems user={user} viewOnly />}</>,
    skills: (
      <>
        {user && (
          <SkillContent
            user={user}
            handleSelectSkill={(skill: Doc<"skills">) => {
              setSelectedSkill(skill);

              setApplicantInfoMode("skillDetails");
            }}
            viewOnly
          />
        )}
      </>
    ),
    skillDetails: (
      <>{user && selectedSkill && <SkillDetails skill={selectedSkill} />}</>
    ),
    achievements: (
      <>
        {user && (
          <AchievementContent
            user={user}
            handleSelectAchievement={(achievement: Doc<"achievements">) => {
              setSelectedAchievement(achievement);

              setApplicantInfoMode("achievementDetails");
            }}
            viewOnly
          />
        )}
      </>
    ),
    achievementDetails: (
      <>
        {user && selectedAchievement && (
          <AchievementDetails achievement={selectedAchievement} />
        )}
      </>
    ),
    experiences: (
      <>
        {user && (
          <ExperienceContent
            user={user}
            handleSelectExperience={(experience: Doc<"experiences">) => {
              setSelectedExperience(experience);

              setApplicantInfoMode("experienceDetails");
            }}
            viewOnly
          />
        )}
      </>
    ),
    experienceDetails: (
      <>
        {user && selectedExperience && (
          <ExperienceDetails experience={selectedExperience} />
        )}
      </>
    ),
  };

  return (
    <Modal
      className={cn("transition-none", {
        "px-0":
          applicantInfoMode !== "" &&
          applicantInfoMode !== "skillDetails" &&
          applicantInfoMode !== "achievementDetails" &&
          applicantInfoMode !== "experienceDetails",
      })}
      headerClassName={cn({
        "px-6":
          applicantInfoMode !== "" &&
          applicantInfoMode !== "skillDetails" &&
          applicantInfoMode !== "achievementDetails" &&
          applicantInfoMode !== "experienceDetails",
      })}
      title={title}
      description={description}
      isOpen={type === "applicantInfo"}
      showBackButton={applicantInfoMode !== ""}
      handleBack={() => {
        if (applicantInfoMode === "skillDetails") {
          setApplicantInfoMode("skills");
        } else if (applicantInfoMode === "achievementDetails") {
          setApplicantInfoMode("achievements");
        } else if (applicantInfoMode === "experienceDetails") {
          setApplicantInfoMode("experiences");
        } else {
          setApplicantInfoMode("");
        }
      }}
      handleClose={() => {
        setApplicantInfoMode("");

        handleClose();
      }}
    >
      {user && contents[applicantInfoMode]}
    </Modal>
  );
}
