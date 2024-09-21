import { ReactNode } from "react";

import ManagePersonalInfoModal from "@/components/modals/manage-personal-info-modal";
import SkillInfoModal from "@/components/modals/skill-info-modal";
import ManageSkillModal from "@/components/modals/manage-skill-modal";
import AchievementInfoModal from "@/components/modals/achievement-info-modal";
import ManageAchievementModal from "@/components/modals/manage-achievement-modal";
import ExperienceInfoModal from "@/components/modals/experience-info-modal";
import ManageExperienceModal from "@/components/modals/manage-experience-modal";
import ProjectInfoModal from "@/components/modals/project-info-modal";
import ManageProjectModal from "@/components/modals/manage-project-modal";
import JobInfoModal from "@/components/modals/job-info-modal";
import ApplicantInfoModal from "@/components/modals/applicant-info-modal";
import CompanyInfoModal from "@/components/modals/company-info-modal";
import ManageJobModal from "@/components/modals/manage-job-modal";
import ManageJobRejectionModal from "@/components/modals/manage-job-rejection-modal";
import JobRejectionInfoModal from "@/components/modals/job-rejection-info-modal";
import ManageThreadModal from "@/components/modals/manage-thread-modal";
import ManagePostModal from "@/components/modals/manage-post-modal";
import ManageCommentModal from "@/components/modals/manage-comment-modal";
import ManageNotificationsModal from "@/components/modals/manage-notifications-modal";
import ManagePresenceModal from "@/components/modals/manage-presence-modal";
import ChangePasswordModal from "@/components/modals/change-password-modal";

type ModalsProviderProps = {
  children: ReactNode;
};

export default function ModalsProvider({ children }: ModalsProviderProps) {
  return (
    <>
      <ManagePersonalInfoModal />
      <SkillInfoModal />
      <ManageSkillModal />
      <AchievementInfoModal />
      <ManageAchievementModal />
      <ExperienceInfoModal />
      <ManageExperienceModal />
      <ProjectInfoModal />
      <ManageProjectModal />
      <JobInfoModal />
      <ApplicantInfoModal />
      <CompanyInfoModal />
      <ManageJobModal />
      <ManageJobRejectionModal />
      <JobRejectionInfoModal />
      <ManageThreadModal />
      <ManagePostModal />
      <ManageCommentModal />
      <ManageNotificationsModal />
      <ManagePresenceModal />
      <ChangePasswordModal />
      {children}
    </>
  );
}
