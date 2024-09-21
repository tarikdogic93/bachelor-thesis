import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    role: v.optional(
      v.union(v.literal("Admin"), v.literal("Applicant"), v.literal("Company")),
    ),
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.optional(v.string()),
    emailAddress: v.string(),
    imageUrl: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
    age: v.optional(v.number()),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    streetAddress: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    establishmentYear: v.optional(v.number()),
    numberOfEmployees: v.optional(v.number()),
    languages: v.optional(v.array(v.string())),
    socialMediaLinks: v.optional(v.array(v.string())),
    searchable: v.optional(v.string()),
  })
    .index("byExternalId", ["externalId"])
    .index("byRole", ["role"])
    .searchIndex("searchFullNameOrEmailAddress", {
      searchField: "searchable",
      filterFields: ["role"],
    }),
  skills: defineTable({
    userId: v.id("users"),
    name: v.string(),
    rating: v.number(),
    description: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  achievements: defineTable({
    userId: v.id("users"),
    title: v.string(),
    category: v.union(
      v.literal("Academic"),
      v.literal("Professional"),
      v.literal("Personal"),
    ),
    date: v.string(),
    affiliatedWith: v.string(),
    description: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  experiences: defineTable({
    userId: v.id("users"),
    title: v.string(),
    establishment: v.string(),
    category: v.union(
      v.literal("Education"),
      v.literal("Certification"),
      v.literal("Competition"),
      v.literal("Internship"),
      v.literal("Volunteer"),
      v.literal("Freelance"),
      v.literal("Work"),
      v.literal("Research"),
      v.literal("Entrepreneurial"),
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isOngoing: v.boolean(),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    settingType: v.union(
      v.literal("Onsite"),
      v.literal("Hybrid"),
      v.literal("Remote"),
    ),
    description: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    category: v.union(
      v.literal("Web development"),
      v.literal("Mobile app development"),
      v.literal("Desktop app development"),
      v.literal("Game development"),
      v.literal("Database management system"),
      v.literal("Content management system"),
      v.literal("E-commerce platform development"),
      v.literal("Artificial intelligence"),
      v.literal("DevOps tools"),
      v.literal("Cloud computing"),
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isOngoing: v.boolean(),
    numberOfPeople: v.optional(v.number()),
    priceRangeMin: v.optional(v.number()),
    priceRangeMax: v.optional(v.number()),
    image: v.optional(
      v.object({ name: v.string(), type: v.string(), url: v.id("_storage") }),
    ),
    description: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  jobs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    jobSector: v.union(
      v.literal("Web development"),
      v.literal("Mobile development"),
      v.literal("Artificial intelligence"),
      v.literal("DevOps engineering"),
      v.literal("Cloud computing"),
      v.literal("Other"),
    ),
    jobType: v.union(
      v.literal("Full-time"),
      v.literal("Part-time"),
      v.literal("Contract"),
      v.literal("Internship"),
    ),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    settingType: v.union(
      v.literal("Onsite"),
      v.literal("Hybrid"),
      v.literal("Remote"),
    ),
    salaryRangeMin: v.number(),
    salaryRangeMax: v.number(),
    benefits: v.array(v.string()),
    educationLevel: v.union(
      v.literal("High school diploma"),
      v.literal("Associate degree"),
      v.literal("Bachelor's degree"),
      v.literal("Master's degree"),
      v.literal("PhD"),
    ),
    experienceLevel: v.union(
      v.literal("Entry level"),
      v.literal("Mid-level"),
      v.literal("Senior level"),
    ),
    techStack: v.array(v.string()),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    startDate: v.string(),
    description: v.optional(v.string()),
    updateTime: v.optional(v.string()),
    applicationDeadline: v.string(),
  })
    .index("byUserId", ["userId"])
    .searchIndex("searchTitle", {
      searchField: "title",
      filterFields: ["userId"],
    }),
  jobApplicants: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("processing"),
      v.literal("accepted"),
      v.literal("rejected"),
    ),
    appliedTime: v.string(),
    rejectionReason: v.optional(v.string()),
    searchable: v.optional(v.string()),
  })
    .index("byUserId", ["userId"])
    .index("byJobId", ["jobId"])
    .index("byUserId_byJobId", ["userId", "jobId"])
    .searchIndex("searchFullNameOrEmailAddress", {
      searchField: "searchable",
      filterFields: ["jobId"],
    }),
  conversations: defineTable({
    type: v.union(v.literal("one-on-one"), v.literal("group")),
    title: v.optional(v.string()),
    participants: v.array(
      v.object({
        userId: v.id("users"),
        status: v.union(
          v.literal("member"),
          v.literal("pending"),
          v.literal("left"),
        ),
      }),
    ),
    messageIds: v.array(v.id("messages")),
  }).index("byType", ["type"]),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    isDeleted: v.boolean(),
    likedByIds: v.array(v.id("users")),
    invisibleToIds: v.array(v.id("users")),
    seenByIds: v.array(v.id("users")),
    updateTime: v.optional(v.string()),
  })
    .index("byConversationId", ["conversationId"])
    .index("bySenderId", ["senderId"]),
  threads: defineTable({
    userId: v.id("users"),
    title: v.string(),
    image: v.optional(
      v.object({
        name: v.string(),
        type: v.string(),
        url: v.id("_storage"),
      }),
    ),
    description: v.optional(v.string()),
    memberIds: v.array(v.id("users")),
    updateTime: v.optional(v.string()),
  })
    .index("byUserId", ["userId"])
    .searchIndex("searchTitle", {
      searchField: "title",
    }),
  posts: defineTable({
    userId: v.id("users"),
    threadId: v.id("threads"),
    title: v.string(),
    content: v.optional(v.string()),
    votes: v.array(
      v.object({
        userId: v.id("users"),
        value: v.union(v.literal("up"), v.literal("down")),
      }),
    ),
    seenByIds: v.array(v.id("users")),
    updateTime: v.optional(v.string()),
  })
    .index("byThreadId", ["threadId"])
    .searchIndex("searchTitle", {
      searchField: "title",
      filterFields: ["threadId"],
    }),
  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    parentCommentId: v.optional(v.id("comments")),
    numberOfReplies: v.number(),
    text: v.string(),
    seenByIds: v.array(v.id("users")),
    updateTime: v.optional(v.string()),
  })
    .index("byPostId", ["postId"])
    .index("byParentCommentId", ["parentCommentId"])
    .index("byPostId_byParentCommentId", ["postId", "parentCommentId"]),
  notifications: defineTable({
    userId: v.id("users"),
    referenceId: v.union(
      v.id("jobs"),
      v.id("threads"),
      v.id("posts"),
      v.id("conversations"),
    ),
    unseenCount: v.optional(v.number()),
    message: v.string(),
  })
    .index("byUserId", ["userId"])
    .index("byUserId_byReferenceId", ["userId", "referenceId"]),
  notificationPreferences: defineTable({
    userId: v.id("users"),
    receiveJobNotifications: v.boolean(),
    receivePostNotifications: v.boolean(),
    receiveCommentNotifications: v.boolean(),
    receiveMessageNotifications: v.boolean(),
  }).index("byUserId", ["userId"]),
  presence: defineTable({
    room: v.string(),
    userId: v.id("users"),
    lastPresentTime: v.string(),
  })
    .index("byUserId", ["userId"])
    .index("byRoom", ["room"])
    .index("byRoom_byUserId", ["room", "userId"]),
  presencePreferences: defineTable({
    userId: v.id("users"),
    showOnlinePresence: v.boolean(),
    doNotDisturb: v.boolean(),
  }).index("byUserId", ["userId"]),
});
