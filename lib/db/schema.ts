import { ObjectId } from "mongodb";

export const collections = {
  users: "users",
  projects: "projects",
  requests: "requests",
  skills: "skills",
  contributorProjectMappings: "contributorProjectMappings",
  feedbacks: "feedbacks",
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
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Project {
  _id: ObjectId;
  name: string;
  description: string;
  techStack: string[];
  status:
    | "Idea"
    | "In Review"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Rejected";
  startDate: Date;
  businessCritical: boolean;
  members: {
    userId: ObjectId;
    role: string;
    joinedAt: Date;
  }[];
  createdBy: ObjectId;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Feedback {
  _id: ObjectId;
  userToId: ObjectId;
  userFromId: ObjectId;
  context: "PROJECT" | "MENTORSHIP" | "FEATURE";
  referenceId: ObjectId;
  feedback: string;
  rating: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Request {
  _id: ObjectId;
  userToId: ObjectId;
  userFromId: ObjectId;
  context: "PROJECT" | "MENTORSHIP" | "FEATURE";
  referenceId: ObjectId;
  message: string;
  skills: string[];
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Feature {
  _id: ObjectId;
  name: string;
  projectId: ObjectId;
  timeline: {
    value: number;
    type: "days" | "weeks" | "months";
  };
  description: string;
  status: "ideation" | "in_progress" | "under_review" | "completed";
  startDate: string; // ISO string
  upvote?: number;
  techStack: string[];
  priority: "low" | "medium" | "high";
  links?: {
    label: string;
    link: string;
  }[];
  contributors?: string[];
}

export interface Skill {
  _id: ObjectId;
  name: string; // Name of the skill
  type: "Technical" | "Soft" | "Other"; // Type of skill (you can adjust these types as needed)
  createdAt: Date; // Date when the skill was created
  updatedAt: Date; // Date when the skill was last updated
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
    freq: "days" | "weeks" | "biweekly" | "monthly";
    type: "online" | "offline" | "both";
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
  status:
    | "Idea"
    | "In Review"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Rejected";
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
  status: "ideation" | "in_progress" | "under_review" | "completed";
  startDate: string; // ISO string
  feedback?: string[];
  upvote?: number;
  techStack: string[];
  priority: "low" | "medium" | "high";
  links?: {
    label: string;
    link: string;
  }[];
  contributors?: string[];
}

export interface Mentorship {
  _id?: ObjectId;
  mentor: string;
  mentee: string;
  startDate: string; // ISO string
  endDate?: string; // Optional ISO string
  status: string; // Status of the mentorship (e.g., 'active', 'inactive')
  progress: number;
  skills: string[];
  duration: number;
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
