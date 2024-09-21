import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

type ModalType =
  | "auth"
  | "personalInfo"
  | "managePersonalInfo"
  | "skillInfo"
  | "manageSkill"
  | "achievementInfo"
  | "manageAchievement"
  | "experienceInfo"
  | "manageExperience"
  | "projectInfo"
  | "manageProject"
  | "jobInfo"
  | "applicantInfo"
  | "companyInfo"
  | "manageJob"
  | "manageJobRejection"
  | "jobRejectionInfo"
  | "manageThread"
  | "managePost"
  | "manageComment"
  | "manageNotifications"
  | "managePresence"
  | "changePassword";

type ModalStoreDataType = {
  signedInUserId?: string;
  user?: Doc<"users">;
  skill?: Doc<"skills">;
  achievement?: Doc<"achievements">;
  experience?: Doc<"experiences">;
  project?: Doc<"projects">;
  job?: Doc<"jobs">;
  rejectionReason?: Doc<"jobApplicants">["rejectionReason"];
  thread?: Doc<"threads">;
  post?: Doc<"posts">;
  editComment?: Doc<"comments">;
  replyComment?: Doc<"comments">;
  notificationPreferences?: Doc<"notificationPreferences"> | null;
  presencePreferences?: Doc<"presencePreferences"> | null;
};

type FocusFieldMediaLinkType<T extends number> = `socialMediaLinks${T}`;

export type FocusFieldType =
  | "firstName"
  | "lastName"
  | "image"
  | "companyName"
  | "gender"
  | "age"
  | "streetAddress"
  | "phoneNumber"
  | "country"
  | "city"
  | "establishmentYear"
  | "numberOfEmployees"
  | "addLanguages"
  | "addSocialMediaLink"
  | FocusFieldMediaLinkType<number>;

type AuthModeType =
  | ""
  | "signin"
  | "signup"
  | "forgotPassword"
  | "resetPassword"
  | "verify";

type ApplicantInfoModeType =
  | ""
  | "personalInfo"
  | "skills"
  | "skillDetails"
  | "achievements"
  | "achievementDetails"
  | "experiences"
  | "experienceDetails";

type CompanyInfoModeType =
  | ""
  | "companyOverview"
  | "projects"
  | "projectDetails";

export type ModalStoreType = {
  type: ModalType | null;
  role?: Doc<"users">["role"];
  data: ModalStoreDataType;
  focusField: FocusFieldType | null;
  authMode: AuthModeType;
  applicantInfoMode: ApplicantInfoModeType;
  companyInfoMode: CompanyInfoModeType;
  setAuthMode: (authMode: AuthModeType, role?: Doc<"users">["role"]) => void;
  setApplicantInfoMode: (applicantInfoMode: ApplicantInfoModeType) => void;
  setCompanyInfoMode: (companyInfoMode: CompanyInfoModeType) => void;
  handleOpen: (
    type: ModalType | null,
    data?: ModalStoreDataType,
    focusField?: FocusFieldType,
  ) => void;
  handleClose: () => void;
};

export const useModalStore = create<ModalStoreType, []>(
  (set): ModalStoreType => ({
    type: null,
    role: undefined,
    data: {},
    focusField: null,
    authMode: "",
    applicantInfoMode: "",
    companyInfoMode: "",
    setAuthMode: (authMode, role) => set({ authMode, role }),
    setApplicantInfoMode: (applicantInfoMode) => set({ applicantInfoMode }),
    setCompanyInfoMode: (companyInfoMode) => set({ companyInfoMode }),
    handleOpen: (type, data, focusField) => set({ type, data, focusField }),
    handleClose: () =>
      set({
        type: null,
        role: undefined,
        data: {},
        focusField: null,
        authMode: "",
        applicantInfoMode: "",
        companyInfoMode: "",
      }),
  }),
);
