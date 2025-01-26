import { User } from "@/lib/types";

export async function getProfile() {
  const res = await fetch("/api/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}

export async function updateProfile(data: Partial<User>) {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}
