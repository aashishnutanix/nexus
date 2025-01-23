import { ObjectId } from 'mongodb';

export const collections = {
  users: 'users',
  projects: 'projects',
  mentorshipRequests: 'mentorshipRequests',
  projectInvites: 'projectInvites'
} as const;

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  skills: string[];
  interests: string[];
  mentoring: ObjectId[];
  mentors: ObjectId[];
  projects: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: ObjectId;
  name: string;
  description: string;
  techStack: string[];
  status: 'Idea' | 'In Review' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
  startDate: Date;
  businessCritical: boolean;
  feedbacks: {
    userId: ObjectId;
    comment: string;
    createdAt: Date;
  }[];
  members: {
    userId: ObjectId;
    role: string;
    joinedAt: Date;
  }[];
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorshipRequest {
  _id: ObjectId;
  mentorId: ObjectId;
  menteeId: ObjectId;
  message: string;
  skills: string[];
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectInvite {
  _id: ObjectId;
  projectId: ObjectId;
  userId: ObjectId;
  role: string;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}