"use client";

import { descriptions, titles } from "@/data/company-info-modal-data";
import { useModalStore } from "@/stores/use-modal-store";
import UserInfoModalOption from "@/components/modals/user-info-modal-option";

export default function CompanyInfoModalOptions() {
  const { setCompanyInfoMode } = useModalStore();

  return (
    <>
      <UserInfoModalOption
        heading={titles["companyOverview"]}
        description={descriptions["companyOverview"]}
        handleClick={() => setCompanyInfoMode("companyOverview")}
      />
      <UserInfoModalOption
        heading={titles["projects"]}
        description={descriptions["projects"]}
        handleClick={() => setCompanyInfoMode("projects")}
      />
    </>
  );
}
