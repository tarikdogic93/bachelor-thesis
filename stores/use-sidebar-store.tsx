import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

export type SidebarStatusType = "fully-open" | "semi-open" | "closed";

type SidebarStoreType = {
  status: SidebarStatusType;
  setStatus: (status: SidebarStatusType) => void;
  handleCollapse: () => void;
  handleExpand: () => void;
  resetStatus: () => void;
};

type SidebarPersistType = (
  config: StateCreator<SidebarStoreType>,
  options: PersistOptions<SidebarStoreType>,
) => StateCreator<SidebarStoreType>;

export const useSidebarStore = create<SidebarStoreType, []>(
  (persist as SidebarPersistType)(
    (set): SidebarStoreType => ({
      status: "semi-open",
      setStatus: (status: SidebarStatusType) => set({ status }),
      handleCollapse: () =>
        set((prev) => ({
          status: prev.status === "fully-open" ? "semi-open" : "closed",
        })),
      handleExpand: () =>
        set((prev) => ({
          status: prev.status === "closed" ? "semi-open" : "fully-open",
        })),
      resetStatus: () => set({ status: "semi-open" }),
    }),
    {
      name: "sidebar",
    },
  ),
);
