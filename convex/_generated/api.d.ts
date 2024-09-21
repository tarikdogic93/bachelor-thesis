/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievements from "../achievements.js";
import type * as analytics from "../analytics.js";
import type * as comments from "../comments.js";
import type * as conversations from "../conversations.js";
import type * as crons from "../crons.js";
import type * as experiences from "../experiences.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as jobApplicants from "../jobApplicants.js";
import type * as jobs from "../jobs.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as notification_preferences from "../notification_preferences.js";
import type * as posts from "../posts.js";
import type * as presence from "../presence.js";
import type * as presence_preferences from "../presence_preferences.js";
import type * as projects from "../projects.js";
import type * as skills from "../skills.js";
import type * as threads from "../threads.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  analytics: typeof analytics;
  comments: typeof comments;
  conversations: typeof conversations;
  crons: typeof crons;
  experiences: typeof experiences;
  files: typeof files;
  http: typeof http;
  jobApplicants: typeof jobApplicants;
  jobs: typeof jobs;
  messages: typeof messages;
  notifications: typeof notifications;
  notification_preferences: typeof notification_preferences;
  posts: typeof posts;
  presence: typeof presence;
  presence_preferences: typeof presence_preferences;
  projects: typeof projects;
  skills: typeof skills;
  threads: typeof threads;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
