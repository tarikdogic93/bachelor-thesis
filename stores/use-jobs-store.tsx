import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

export type JobsStoreType = {
  activeJob: Doc<"jobs"> | null;
  setActiveJob: (job: Doc<"jobs">) => void;
  resetActiveJob: () => void;
  resetJobsStore: () => void;
};

export const useJobsStore = create<JobsStoreType, []>(
  (set): JobsStoreType => ({
    activeJob: null,
    setActiveJob: (job) => set({ activeJob: job }),
    resetActiveJob: () =>
      set({
        activeJob: null,
      }),
    resetJobsStore: () =>
      set({
        activeJob: null,
      }),
  }),
);
