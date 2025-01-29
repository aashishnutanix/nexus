import { ObjectId } from "mongodb";
import { getSkillName } from "./skills";
import { getUserNameById } from "./users";
import { RequestType } from "@/lib/types";


export interface Mentorship {
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

interface ContributorProjectMapping {
  contributorId: ObjectId; // Reference to User
  projectId: ObjectId; // Reference to Project
  status: string; // Status of the contribution (e.g., 'active', 'inactive')
  featureId?: ObjectId; // Optional reference to a specific feature
  startDate: string; // ISO string representing the start date
}

interface ContributorMentorshipMapping {
  contributorId: ObjectId; // Reference to User
  mentorshipId: ObjectId; // Reference to Mentorship
  status: string; // Status of the contribution (e.g., 'active', 'inactive')
  startDate: string; // ISO string representing the start date
}

export async function createRequest(data: Request) {
  const res = await fetch("/api/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create Request");
  }

  return res.json();
}

export async function getRequests() {
  const res = await fetch("/api/requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch requests");
  }

  return res.json();
}

export async function updateRequestStatus(id: string, status: "Accepted" | "Rejected") {
  const res = await fetch("/api/requests", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update request status");
  }

  return res.json();
}

export async function getPendingRequests() {
  const res = await fetch("/api/requests?status=Pending", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pending request");
  }

  return res.json();  
}

export async function addContributorProjectMapping( contributorProjectMapping: ContributorProjectMapping) {

  const res = await fetch("/api/contributorProjectMappings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contributorProjectMapping),
  });

  if (!res.ok) {
    throw new Error("Failed to add contributor mentorship mapping");
  }

  return res.json();

}


export async function createMentorshipFromRequest( request: RequestType, profile: any) {



  let mentorship: Mentorship = { 
    name: "Mentorship For " + "JavaScript" + " with " + profile.name,
    // To do : Can we make it mentorId instead of mentor name ?
    mentor: request.userToId,
    mentee: request.userFromId,
    progress: 0,
    status: "active",
    skillId: request.skillId,
    startDate: new Date().toISOString(),
  }

  const res = await fetch("/api/mentorships", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mentorship),
  });

  if (!res.ok) {
    throw new Error("Failed to create mentorship");
  }

  return res.json();

}