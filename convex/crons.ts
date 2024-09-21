import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Create notification for unseen post",
  { minutes: 15 },
  internal.notifications.createPostsNotification,
);

crons.interval(
  "Create notification for unseen comments",
  { minutes: 10 },
  internal.notifications.createCommentsNotification,
);

crons.interval(
  "Create notification for unseen messages",
  { minutes: 5 },
  internal.notifications.createMessagesNotification,
);

export default crons;
