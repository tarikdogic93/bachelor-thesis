"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { descriptions, titles } from "@/data/company-info-modal-data";
import { Doc } from "@/convex/_generated/dataModel";
import { useModalStore } from "@/stores/use-modal-store";
import Modal from "@/components/ui/modal";
import CompanyInfoModalOptions from "@/components/modals/company-info-modal-options";
import PersonalInfoItems from "@/components/contents/personal-info-items";
import ProjectContent from "@/components/contents/project-content";
import ProjectDetails from "@/components/contents/project-details";

export default function CompanyInfoModal() {
  const { type, data, companyInfoMode, setCompanyInfoMode, handleClose } =
    useModalStore();
  const [selectedProject, setSelectedProject] =
    useState<Doc<"projects"> | null>(null);

  const user = data?.user;

  const title = titles[companyInfoMode];
  const description = descriptions[companyInfoMode];

  const contents = {
    "": <CompanyInfoModalOptions />,
    companyOverview: <>{user && <PersonalInfoItems user={user} viewOnly />}</>,
    projects: (
      <>
        {user && (
          <ProjectContent
            user={user}
            handleSelectProject={(project: Doc<"projects">) => {
              setSelectedProject(project);

              setCompanyInfoMode("projectDetails");
            }}
            viewOnly
          />
        )}
      </>
    ),
    projectDetails: (
      <>
        {user && selectedProject && (
          <ProjectDetails project={selectedProject} />
        )}
      </>
    ),
  };

  return (
    <Modal
      className={cn("transition-none", {
        "px-0": companyInfoMode !== "" && companyInfoMode !== "projectDetails",
      })}
      headerClassName={cn({
        "px-6": companyInfoMode !== "" && companyInfoMode !== "projectDetails",
      })}
      title={title}
      description={description}
      isOpen={type === "companyInfo"}
      showBackButton={companyInfoMode !== ""}
      handleBack={() => {
        if (companyInfoMode === "projectDetails") {
          setCompanyInfoMode("projects");
        } else {
          setCompanyInfoMode("");
        }
      }}
      handleClose={() => {
        setCompanyInfoMode("");

        handleClose();
      }}
    >
      {user && contents[companyInfoMode]}
    </Modal>
  );
}
