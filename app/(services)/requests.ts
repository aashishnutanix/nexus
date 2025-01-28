import { Request } from "@/lib/types";
import { ObjectId } from "mongodb";

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

export async function getMentorshipRequestsRecieved() {

  return [ {
    userToId: 'mentor1',
    userFromId: 'mentorCena'
  }, {
    userToId: 'mentor2',
    userFromId: 'mentor5'
  }, {
    userToId: 'mentor3',
    userFromId: 'mentor9'
  } ];
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


export async function addContributorMentorshipMapping( contributorMentorshipMapping: ContributorMentorshipMapping) {

  const res = await fetch("/api/contributorMentorshipMappings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contributorMentorshipMapping),
  });

  if (!res.ok) {
    throw new Error("Failed to add contributor mentorship mapping");
  }

  return res.json();

}

