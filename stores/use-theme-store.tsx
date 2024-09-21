import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type ThemeStoreType = {
  theme: string;
  setTheme: (theme: string) => void;
};

type ThemePersistType = (
  config: StateCreator<ThemeStoreType>,
  options: PersistOptions<ThemeStoreType>,
) => StateCreator<ThemeStoreType>;

export const useThemeStore = create<ThemeStoreType, []>(
  (persist as ThemePersistType)(
    (set): ThemeStoreType => ({
      theme: "zinc",
      setTheme: (theme: string) => set({ theme }),
    }),
    {
      name: "theme",
    },
  ),
);
