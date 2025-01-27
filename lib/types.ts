import { z } from "zod";
import { DefaultSession } from "next-auth";

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

// Schemas
export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional(),
  team: z.string().optional(),
  dept: z.string().optional(),
  skills: z.array(z.string()).optional(),
  manager: z.string().optional(),
  interests: z.array(z.string()).optional(),
  offering: z
    .array(
      z.object({
        freq: z.enum(["days", "weeks", "biweekly", "monthly"]),
        type: z.enum(["online", "offline", "both"]),
        duration: z.number(),
      })
    )
    .optional(),
    isAvailable: z.boolean().optional(),
  designation: z.string().optional(),
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
});

export const FeatureSchema = z.object({
  name: z.string().min(1),
  projectId: z.string(),
  timeline: z.number(),
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
});

export const RequestSchema = z.object({
  userToId: z.string(),
  userFromId: z.string(),
  context: RequestContextEnum,
  referenceId: z.string(),
  message: z.string().min(10).max(500),
  skills: z.array(z.string()).min(1),
  status: RequestStatusEnum.default("Pending"),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(), // ISO string
});

export const LocationSchema = z.object({
  timezone: z.string().min(1),
  region: RegionEnum,
  city: z.string().min(1),
  country: z.string().min(1),
});

// Types
export type User = z.infer<typeof UserSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type Request = z.infer<typeof RequestSchema>;
export type Location = z.infer<typeof LocationSchema>;

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
      freq: "days" | "weeks" | "biweekly" | "monthly";
      type: "online" | "offline" | "both";
      time: number;
    };
    availability?: boolean;
    designation?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
