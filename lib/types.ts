import { z } from 'zod';
import { DefaultSession } from "next-auth";

// Enums
export const UserRoleEnum = z.enum(["user", "admin", "manager"]);
export const SkillTypeEnum = z.enum(["technical", "management", "creative"]);
export const SkillLevelEnum = z.enum(["0", "1", "2", "3"]);
export const RegionEnum = z.enum(["americas", "emea", "asia_pacific"]);
export const RequestTypeEnum = z.enum(["mentorship", "project_rotation"]);
export const RequestStatusEnum = z.enum(["accepted", "rejected", "pending"]);
export const MentorshipStatusEnum = z.enum(["active", "completed", "paused", "cancelled"]);
export const ProjectStatusEnum = z.enum(["Idea", "In Review", "Approved", "In Progress", "Completed", "Rejected"]);
export const FeatureStatusEnum = z.enum(["ideation", "in_progress", "under_review", "completed"]);
export const PriorityEnum = z.enum(["low", "medium", "high"]);

// Schemas
export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  team: z.string().optional(),
  dept: z.string().optional(),
  skillset: z.array(z.string()).optional(),
  manager: z.string().optional(),
  interests: z.array(z.string()).optional(),
  offering: z.object({
    freq: z.enum(["days", "weeks", "biweekly", "monthly"]),
    type: z.enum(["online", "offline", "both"]),
    time: z.number()
  }).optional(),
  availability: z.boolean().optional(),
  designation: z.string().optional(),
  hashedPassword: z.string().optional(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(), // ISO string
  bio: z.string().optional(),
  image: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  techStack: z.array(z.string()),
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
  links: z.array(z.object({
    label: z.string(),
    link: z.string()
  })).optional(),
  contributors: z.array(z.string()).optional(),
});

// Types
export type User = z.infer<typeof UserSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Feature = z.infer<typeof FeatureSchema>;

export const MentorshipRequestSchema = z.object({
  mentorId: z.string(),
  menteeId: z.string(),
  message: z.string().min(10).max(500),
  skills: z.array(z.string()).min(1),
  status: z.enum(['Pending', 'Accepted', 'Rejected']).default('Pending')
});

export const ProjectInviteSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  role: z.string(),
  message: z.string().optional(),
  status: z.enum(['Pending', 'Accepted', 'Rejected']).default('Pending')
});

export type MentorshipRequest = z.infer<typeof MentorshipRequestSchema>;
export type ProjectInvite = z.infer<typeof ProjectInviteSchema>;

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
      freq: 'days' | 'weeks' | 'biweekly' | 'monthly';
      type: 'online' | 'offline' | 'both';
      time: number;
    };
    availability?: boolean;
    designation?: string;
  }

  interface Session {
    user: User & DefaultSession["user"]
  }
}