import { ObjectId } from 'mongodb';

export const collections = {
  users: 'users',
  projects: 'projects',
  mentorshipRequests: 'mentorshipRequests',
  projectInvites: 'projectInvites',
  features: 'features'
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

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  image: string;
  hashedPassword?: string;
  team?: string;
  dept?: string;
  skillset?: string[];
  manager?: string;
  interests?: string[];
  bio?: string;
  offering?: {
    freq: 'days' | 'weeks' | 'biweekly' | 'monthly';
    type: 'online' | 'offline' | 'both';
    time: number;
  };
  availability?: boolean;
  designation?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ProjectDocument {
  _id?: ObjectId;
  name: string;
  owner?: string;
  description: string;
  techStack: string[];
  startDate: string; // ISO string
  status: 'Idea' | 'In Review' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
  feedbacks?: string[];
  department?: string;
  upVotes?: number;
  contributors?: string[];
  open?: boolean;
  businessCritical: boolean;
  features?: FeatureDocument[];
}

export interface FeatureDocument {
  _id?: ObjectId;
  name: string;
  projectId: string;
  timeline: number;
  description: string;
  status: 'ideation' | 'in_progress' | 'under_review' | 'completed';
  startDate: string; // ISO string
  feedback?: string[];
  upvote?: number;
  techStack: string[];
  priority: 'low' | 'medium' | 'high';
  links?: {
    label: string;
    link: string;
  }[];
  contributors?: string[];
}