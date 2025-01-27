import { Request } from "@/lib/types";

export async function createRequest(data: Request) {
  const res = await fetch("/api/request", {
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

