"use client";

import { descriptions, titles } from "@/data/applicant-info-modal-data";
import { useModalStore } from "@/stores/use-modal-store";
import UserInfoModalOption from "@/components/modals/user-info-modal-option";

export default function ApplicantInfoModalOptions() {
  const { setApplicantInfoMode } = useModalStore();

  return (
    <>
      <UserInfoModalOption
        heading={titles["personalInfo"]}
        description={descriptions["personalInfo"]}
        handleClick={() => setApplicantInfoMode("personalInfo")}
      />
      <UserInfoModalOption
        heading={titles["skills"]}
        description={descriptions["skills"]}
        handleClick={() => setApplicantInfoMode("skills")}
      />
      <UserInfoModalOption
        heading={titles["achievements"]}
        description={descriptions["achievements"]}
        handleClick={() => setApplicantInfoMode("achievements")}
      />
      <UserInfoModalOption
        heading={titles["experiences"]}
        description={descriptions["experiences"]}
        handleClick={() => setApplicantInfoMode("experiences")}
      />
    </>
  );
}
