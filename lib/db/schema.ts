import { ObjectId } from 'mongodb';

export const collections = {
  users: 'users',
  projects: 'projects',
  mentorshipRequests: 'mentorshipRequests',
  projectInvites: 'projectInvites',
  features: 'features',
  skills: 'skills', 
  contributorProjectMappings: 'contributorProjectMappings',
  locations: 'locations',
  feedbacks: 'feedbacks',
  mentorships: 'mentorships',
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
  hashedPassword?: string;
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

export interface Skill {
  _id: ObjectId;
  name: string; // Name of the skill
  type: 'Technical' | 'Soft' | 'Other'; // Type of skill (you can adjust these types as needed)
  createdAt: Date; // Date when the skill was created
  updatedAt: Date; // Date when the skill was last updated
}

export interface ContributorProjectMapping {
  _id?: ObjectId; // Unique identifier
  contributorId: ObjectId; // Reference to User
  projectId: ObjectId; // Reference to Project
  status: string; // Status of the contribution (e.g., 'active', 'inactive')
  featureId?: ObjectId; // Optional reference to a specific feature
  startDate: string; // ISO string representing the start date
  endDate?: string; // Optional ISO string representing the end date
}

export interface Location {
  _id?: ObjectId; // Unique identifier
  timezone: string; // E.g., 'GMT-5', 'UTC+1', etc.
  region: 'AMERICAS' | 'EMEA' | 'ASIA-PACIFIC'; // Specify allowed regions
  city: string; // Name of the city
  country: string; // Country name
}

export interface Feedback {
  _id: ObjectId; // Unique identifier for the feedback
  userToId: ObjectId; // Reference to the user receiving feedback
  userFromId: ObjectId; // Reference to the user giving feedback
  context: 'mentorship' | 'project'; // Context of the feedback (e.g., mentorship or project)
  referenceId: ObjectId; // Reference to the associated entity (e.g., a project, task, etc.)
  rating: number; // Numerical rating for the feedback
  date: Date; // Date when the feedback was given
  // optional?: ObjectId; // Optional additional field (e.g., skillId)
}

export interface Mentorship {
  _id: ObjectId; // Unique identifier for the mentorship
  name: string; // Name of the mentorship program or relationship
  mentor: ObjectId; // Reference to the mentor (User)
  mentee: ObjectId; // Reference to the mentee (User)
  progress: number; // Progress of the mentorship (percentage or number)
  status: string; // Current status of the mentorship (e.g., 'active', 'completed', 'paused')
  startDate: Date; // Start date of the mentorship
  skillId: ObjectId; // Reference to the Skill
  endDate?: Date; // Optional end date of the mentorship
  duration?: number; // Optional duration of the mentorship in days, weeks, or months
}


// example of a query to fetch contributor and project details using aggregation

// db.contributorProjectMappings.aggregate([
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'contributorId',
//       foreignField: '_id',
//       as: 'userDetails'
//     }
//   },
//   {
//     $lookup: {
//       from: 'projects',
//       localField: 'projectId',
//       foreignField: '_id',
//       as: 'projectDetails'
//     }
//   }
// ]);