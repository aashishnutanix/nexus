import { Skill } from "@/lib/types";

export async function createSkill(data: Skill) {
  const res = await fetch("/api/skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create skill");
  }

  return res.json();
}
