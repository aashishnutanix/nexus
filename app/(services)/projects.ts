import { Project } from "@/lib/types";

export async function createProject(data: Project) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}

export async function editProject(id: string, data: Project) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to edit project");
  }

  return res.json();
}

export async function getProjects() {
  const res = await fetch("/api/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export async function getProject(id: string) {
  const res = await fetch(`/api/projects?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }

  return res.json();
}
