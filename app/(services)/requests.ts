import { Request } from "@/lib/types";

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

