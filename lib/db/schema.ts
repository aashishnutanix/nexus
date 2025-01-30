import { ObjectId } from "mongodb";

export const collections = {
  users: "users",
  projects: "projects",
  requests: "requests",
  features: "features",
  skills: "skills",
  contributorProjectMappings: "contributorProjectMappings",
  locations: "locations",
  feedbacks: "feedbacks",
  mentorships: "mentorships",
  upvotes: "upvotes",
  designations: "designations",
} as const;

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  skills: ObjectId[]; // Array of skill IDs
  interests: ObjectId[]; // Array of interest IDs
  location: ObjectId;
  isAvailable: boolean;
  offering: {
    freq: "days" | "weeks" | "biweekly" | "monthly";
    type: "online" | "offline" | "both";
    duration: number;
  };
  designation: {
    _id: ObjectId;
    name: string;
    type: string;
    level: number;
  };
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
  startDate: string; // ISO string
  businessCritical: boolean;
  members: {
    userId: ObjectId;
    role: string;
    joinedAt: string; // ISO string
  }[];
  features: Feature[];
  bandwidthRequiredForContribution: number; // Percentage of bandwidth required per week
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
  skillId: ObjectId;
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
  upvote?: UpVote[]
  techStack: string[];
  priority: "low" | "medium" | "high";
  links?: {
    label: string;
    link: string;
  }[];
  bandwidthRequiredForContribution: number; // Percentage of bandwidth required per week
}

export interface Skill {
  _id: ObjectId;
  name: string; // Name of the skill
  type: "Technical" | "Soft" | "Other"; // Type of skill (you can adjust these types as needed)
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface UpVote{
  _id?: ObjectId;
  referenceId: ObjectId;
  userId: ObjectId;
  context: "PROJECT" | "FEATURE" | "MENTORSHIP";
  createdAt: string;
}

export interface ContributorProjectMapping {
  _id?: ObjectId; // Unique identifier
  contributorId: ObjectId; // Reference to User
  projectId: ObjectId; // Reference to Project
  status: string; // Status of the contribution (e.g., 'active', 'inactive')
  featureId?: ObjectId; // Optional reference to a specific feature
  startDate: string; // ISO string representing the start date
  endDate?: string; // Optional ISO string representing the end date
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Location {
  _id?: ObjectId; // Unique identifier
  timezone: string; // E.g., 'GMT-5', 'UTC+1', etc.
  region: "AMERICAS" | "EMEA" | "ASIA-PACIFIC"; // Specify allowed regions
  city: string; // Name of the city
  country: string; // Country name
}

export interface Feedback {
  _id: ObjectId; // Unique identifier for the feedback
  userToId: ObjectId; // Reference to the user receiving feedback
  userFromId: ObjectId; // Reference to the user giving feedback
  context: "PROJECT" | "MENTORSHIP" | "FEATURE"; // Context of the feedback (e.g., mentorship or project)
  referenceId: ObjectId; // Reference to the associated entity (e.g., a project, task, etc.)
  rating: number; // Numerical rating for the feedback
  date: string; // ISO string representing the date when the feedback was given
}

export interface Mentorship {
  _id: ObjectId; // Unique identifier for the mentorship
  name: string; // Name of the mentorship program or relationship
  mentor: ObjectId; // Reference to the mentor (User)
  mentee: ObjectId; // Reference to the mentee (User)
  progress: number; // Progress of the mentorship (percentage or number)
  status: string; // Current status of the mentorship (e.g., 'active', 'completed', 'paused')
  startDate: string; // ISO string representing the start date of the mentorship
  skillId: ObjectId; // Reference to the Skill
  endDate?: string; // Optional ISO string representing the end date of the mentorship
  duration?: number; // Optional duration of the mentorship in days, weeks, or months
  description: string; // Description of the mentorship
}

export interface Designation {
  _id: ObjectId; // Unique identifier for the designation
  name: string; // Name of the designation (e.g., 'Software Engineer', 'Manager')
  level: number; // Level of the designation (e.g., 1 for junior, 2 for mid, 3 for senior)
  code: string; // Code representing the designation (e.g., 'SE1', 'MGR')
  type: string; // Domain to which the designation belongs (e.g., 'Engineering', 'Sales', 'HR')
}

export interface Contact {
  email: string; // Email address of the contact
  socialHandles: string[]; // Array of social media handles (e.g., Twitter, LinkedIn URLs)
  phoneNumber: string; // Phone number of the contact (in E.164 format for consistency, e.g., +1234567890)
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
