import { z } from "zod";
import { DefaultSession } from "next-auth";
import { ObjectId } from "mongodb";

// Enums
export const UserRoleEnum = z.enum(["user", "admin", "manager"]);
export const SkillTypeEnum = z.enum(["technical", "management", "creative"]);
export const SkillLevelEnum = z.enum(["0", "1", "2", "3"]);
export const RegionEnum = z.enum(["AMERICAS", "EMEA", "ASIA-PACIFIC"]);
export const RequestContextEnum = z.enum(["PROJECT", "MENTORSHIP", "FEATURE"]);
export const RequestStatusEnum = z.enum(["Pending", "Accepted", "Rejected"]);
export const MentorshipStatusEnum = z.enum([
  "active",
  "completed",
  "paused",
  "cancelled",
]);
export const ProjectStatusEnum = z.enum([
  "Idea",
  "In Review",
  "Approved",
  "In Progress",
  "Completed",
  "Rejected",
]);
export const FeatureStatusEnum = z.enum([
  "ideation",
  "in_progress",
  "under_review",
  "completed",
]);
export const PriorityEnum = z.enum(["low", "medium", "high"]);

// Small Schemas
export const SkillSchema = z.object({
  name: z.string().min(1),
  type: SkillTypeEnum,
  level: SkillLevelEnum,
});

export const DesignationSchema = z.object({
  name: z.string(),
  level: z.string(),
  type: z.string(),
  code: z.string(),
});

export const OfferingSchema = z.object({
  freq: z.enum(["Daily", "Weekly", "Biweekly", "Monthly"]),
  type: z.enum(["Virtually", "In-Person", "Both"]),
  duration: z.number(),
});

export const FeedbackSchema = z.object({
  userToId: z.string(),
  userFromId: z.string(),
  context: RequestContextEnum,
  referenceId: z.string(),
  feedback: z.string().min(10).max(500),
  rating: z.number(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(), // ISO string
});

// Large Schemas
export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional(),
  team: z.string().optional(),
  dept: z.string().optional(),
  skills: z.array(z.string()).optional(),
  manager: z.string().optional(),
  interests: z.array(z.string()).optional(),
  offering: OfferingSchema.optional(),
  isAvailable: z.boolean().optional(),
  designation: DesignationSchema.optional(),
  hashedPassword: z.string().optional(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(), // ISO string
  bio: z.string().optional(),
  image: z.string().optional(),
  location: z
    .object({
      timezone: z.string(),
      region: RegionEnum,
      city: z.string(),
      country: z.string(),
    })
    .optional(),
  mentoring: z
    .array(
      z.object({
        name: z.string(),
        image: z.string(),
        focus: z.string(),
        progress: z.number(),
        skills: z.array(z.string()),
      })
    )
    .optional(),
  mentors: z
    .array(
      z.object({
        name: z.string(),
        image: z.string(),
        focus: z.string(),
        skills: z.array(z.string()),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        status: ProjectStatusEnum,
        progress: z.number(),
        techStack: z.array(z.string()),
      })
    )
    .optional(),
});

export const UpVoteSchema = z.object({
  referenceId: z.string(),
  context: z.string(),
});

export const FeatureSchema = z.object({
  _id: z.string().optional(),
  featureId: z.string().optional(),
  name: z.string().min(1),
  projectId: z.string(),
  timeline: z.object({
    value: z.number(),
    type: z.enum(["days", "weeks", "months"]),
  }),
  description: z.string(),
  status: FeatureStatusEnum,
  startDate: z.string(), // ISO string
  feedback: z.array(z.string()).optional(),
  upvote: z.number().optional(),
  techStack: z.array(z.string()),
  priority: PriorityEnum,
  links: z
    .array(
      z.object({
        label: z.string(),
        link: z.string(),
      })
    )
    .optional(),
  contributors: z.array(z.string()).optional(),
  bandwidthRequiredForContribution: z.number(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  techStack: z.array(z.string()).min(1),
  status: ProjectStatusEnum,
  startDate: z.string(),
  businessCritical: z.boolean(),
  department: z.string().optional(),
  upVotes: z.number().optional(),
  contributors: z.array(z.string()).optional(),
  open: z.boolean().optional(),
  bandwidthRequiredForContribution: z.number(),
  createdBy: z.string().optional(),
  members: z.array(UserSchema).min(0).default([]).optional(),
  features: z.array(FeatureSchema).min(0).default([]).optional(),
});

export const RequestSchema = z.object({
  userToId: z.string(),
  userFromId: z.string(),
  context: RequestContextEnum,
  referenceId: z.string(),
  message: z.string().min(10).max(500),
  skillId: z.string(),
  status: RequestStatusEnum.default("Pending"),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(), // ISO string
  userIds: z.array(z.string()).optional(),
});

export const LocationSchema = z.object({
  timezone: z.string().min(1),
  region: RegionEnum,
  city: z.string().min(1),
  country: z.string().min(1),
});

// Types
export type SkillType = z.infer<typeof SkillSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
export type FeatureType = z.infer<typeof FeatureSchema>;
export type RequestType = z.infer<typeof RequestSchema>;
export type UpVoteType = z.infer<typeof UpVoteSchema>;
export type LocationType = z.infer<typeof LocationSchema>;
export type OfferingType = z.infer<typeof OfferingSchema>;
export type DesignationType = z.infer<typeof DesignationSchema>;
export type FeedbackType = z.infer<typeof FeedbackSchema>;
export type ProjectStatusType = z.infer<typeof ProjectStatusEnum>;
export type SearchResultType = {
  [key: string]: Array<{
    _id: string;
    name?: string;
    description?: string;
    email?: string;
  }>;
};

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    team?: string;
    dept?: string;
    skillset?: string[];
    manager?: string;
    interests?: string[];
    offering?: {
      freq: "Daily" | "Weekly" | "Biweekly" | "Monthly";
      type: "Virtually" | "In-Person" | "Both";
      time: number;
    };
    availability?: boolean;
    designation?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
