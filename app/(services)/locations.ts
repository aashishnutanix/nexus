import { LocationType } from "@/lib/types";

export async function createLocation(data: LocationType) {
  const res = await fetch("/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create location");
  }

  return res.json();
}

export async function getLocations() {
  const res = await fetch("/api/locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch locations");
  }

  return res.json();
}

export async function getLocation(id: string) {
  const res = await fetch(`/api/locations?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch location");
  }

  return res.json();
}
