import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export type PositionType = "left" | "right";

type LayoutStoreType = {
  position: PositionType;
  setPosition: (position: PositionType) => void;
};

type LayoutPersistType = (
  config: StateCreator<LayoutStoreType>,
  options: PersistOptions<LayoutStoreType>,
) => StateCreator<LayoutStoreType>;

export const useLayoutStore = create<LayoutStoreType, []>(
  (persist as LayoutPersistType)(
    (set): LayoutStoreType => ({
      position: "left",
      setPosition: (position: PositionType) => set({ position }),
    }),
    {
      name: "layout",
    },
  ),
);
