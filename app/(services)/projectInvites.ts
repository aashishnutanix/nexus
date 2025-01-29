import { RequestType } from "@/lib/types";

export async function createProjectInvite(data: RequestType) {
  const res = await fetch("/api/projectInvites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create project invite");
  }

  return res.json();
}
