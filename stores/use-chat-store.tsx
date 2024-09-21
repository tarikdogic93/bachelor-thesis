import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

export type ChatStoreType = {
  activeConversation:
    | (Doc<"conversations"> & {
        users: (Doc<"users"> | null)[];
      })
    | null;
  editMessage:
    | (Doc<"messages"> & {
        sender: Doc<"users"> | null;
      })
    | null;
  setActiveConversation: (
    conversation: Doc<"conversations"> & {
      users: (Doc<"users"> | null)[];
    },
  ) => void;
  setEditMessage: (
    message: Doc<"messages"> & {
      sender: Doc<"users"> | null;
    },
  ) => void;
  resetActiveConversation: () => void;
  resetEditMessage: () => void;
  resetChatStore: () => void;
};

export const useChatStore = create<ChatStoreType, []>(
  (set): ChatStoreType => ({
    activeConversation: null,
    editMessage: null,
    setActiveConversation: (conversation) =>
      set({ activeConversation: conversation }),
    setEditMessage: (message) => set({ editMessage: message }),
    resetActiveConversation: () =>
      set({
        activeConversation: null,
      }),
    resetEditMessage: () =>
      set({
        editMessage: null,
      }),
    resetChatStore: () =>
      set({
        activeConversation: null,
        editMessage: null,
      }),
  }),
);
