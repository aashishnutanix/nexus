import { SkillType } from "@/lib/types";

export async function createSkill(data: SkillType) {
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

export async function getSkillName( skillId: String ) {

  const res = await fetch(`/api/skills?_id=${skillId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch skill");
  }

  return await res.json().then((data) => {
    return data.name;
  });

}
