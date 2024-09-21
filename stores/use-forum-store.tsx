import { create } from "zustand";

import { Doc, Id } from "@/convex/_generated/dataModel";

export type ForumStoreType = {
  activeThread: Doc<"threads"> | null;
  activePost: Doc<"posts"> | null;
  flattenedComments: {
    comment: Doc<"comments">;
    level: number;
    expanded: boolean;
  }[];
  setActiveThread: (thread: Doc<"threads">) => void;
  setActivePost: (post: Doc<"posts">) => void;
  addFlattenedComment: (
    comment: Doc<"comments">,
    level: number,
    parentCommentId?: Id<"comments">,
  ) => void;
  removeFlattenedComments: (commentIds: Id<"comments">[]) => void;
  toggleFlattenedComment: (commentId: Id<"comments">) => void;
  expandFlattenedComment: (commentId: Id<"comments">) => void;
  collapseFlattenedComment: (commentId: Id<"comments">) => void;
  resetActiveThread: () => void;
  resetActivePost: () => void;
  resetFlattenedComments: () => void;
  resetForumStore: () => void;
};

export const useForumStore = create<ForumStoreType, []>(
  (set): ForumStoreType => ({
    activeThread: null,
    activePost: null,
    flattenedComments: [],
    setActiveThread: (thread) => set({ activeThread: thread }),
    setActivePost: (post) => set({ activePost: post }),
    addFlattenedComment: (comment, level, parentCommentId) =>
      set((state) => {
        const existingComment = state.flattenedComments.find(
          (obj) => obj.comment._id === comment._id,
        );

        const existingParentCommentIndex = state.flattenedComments.findIndex(
          (obj) => obj.comment._id === parentCommentId,
        );

        const lastChildOfExistingParentCommentIndex =
          state.flattenedComments.findLastIndex(
            (obj) =>
              obj.comment.parentCommentId === parentCommentId &&
              obj.level === level,
          );

        if (!existingComment) {
          if (existingParentCommentIndex === -1) {
            return {
              flattenedComments: [
                ...state.flattenedComments,
                { comment, level, expanded: false },
              ],
            };
          } else if (lastChildOfExistingParentCommentIndex !== -1) {
            const lastChildOfExistingParentComment =
              state.flattenedComments[lastChildOfExistingParentCommentIndex];

            const existingCommentLevelBeforeIndex =
              state.flattenedComments.findIndex(
                (obj, index) =>
                  obj.level < lastChildOfExistingParentComment.level &&
                  index > lastChildOfExistingParentCommentIndex,
              );

            if (existingCommentLevelBeforeIndex === -1) {
              return {
                flattenedComments: [
                  ...state.flattenedComments,
                  { comment, level, expanded: false },
                ],
              };
            } else {
              return {
                flattenedComments: [
                  ...state.flattenedComments.slice(
                    0,
                    existingCommentLevelBeforeIndex,
                  ),
                  { comment, level, expanded: false },
                  ...state.flattenedComments.slice(
                    existingCommentLevelBeforeIndex,
                  ),
                ],
              };
            }
          } else {
            return {
              flattenedComments: [
                ...state.flattenedComments.slice(
                  0,
                  existingParentCommentIndex + 1,
                ),
                { comment, level, expanded: false },
                ...state.flattenedComments.slice(
                  existingParentCommentIndex + 1,
                ),
              ],
            };
          }
        }

        return state;
      }),
    removeFlattenedComments: (commentIds) =>
      set((state) => ({
        flattenedComments: state.flattenedComments.filter(
          (obj) => !commentIds.includes(obj.comment._id),
        ),
      })),
    toggleFlattenedComment: (commentId) =>
      set((state) => ({
        flattenedComments: state.flattenedComments.map((obj) => {
          if (obj.comment._id === commentId) {
            return {
              ...obj,
              expanded: !obj.expanded,
            };
          }

          return obj;
        }),
      })),
    expandFlattenedComment: (commentId) =>
      set((state) => ({
        flattenedComments: state.flattenedComments.map((obj) => {
          if (obj.comment._id === commentId) {
            return {
              ...obj,
              expanded: true,
            };
          }

          return obj;
        }),
      })),
    collapseFlattenedComment: (commentId) =>
      set((state) => ({
        flattenedComments: state.flattenedComments.map((obj) => {
          if (obj.comment._id === commentId) {
            return {
              ...obj,
              expanded: false,
            };
          }

          return obj;
        }),
      })),
    resetActiveThread: () =>
      set({
        activeThread: null,
      }),
    resetActivePost: () =>
      set({
        activePost: null,
      }),
    resetFlattenedComments: () =>
      set({
        flattenedComments: [],
      }),
    resetForumStore: () =>
      set({
        activeThread: null,
        activePost: null,
        flattenedComments: [],
      }),
  }),
);
