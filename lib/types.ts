import { z } from 'zod';

export const ProjectStatus = z.enum([
  'Idea',
  'In Review',
  'Approved',
  'In Progress',
  'Completed',
  'Rejected'
]);

export const ProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  techStack: z.array(z.string()).min(1),
  status: ProjectStatus,
  startDate: z.date(),
  businessCritical: z.boolean(),
  feedbacks: z.array(z.object({
    userId: z.string(),
    comment: z.string(),
    createdAt: z.date()
  })).default([])
});

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

export type Project = z.infer<typeof ProjectSchema>;
export type MentorshipRequest = z.infer<typeof MentorshipRequestSchema>;
export type ProjectInvite = z.infer<typeof ProjectInviteSchema>;