import { UserType } from "@/lib/types";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function editUser(id: string, data: UserType) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to edit user");
  }

  return res.json();
}

export async function getUsers() {
  const res = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}

export async function getUserById(id: string) {
  const res = await fetch(`/api/users?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch user");
  }

  return res.json();
}

export async function getUserByIds(ids: string[]) {
  const res = await fetch(`/api/users?ids=${ids.join(",")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function getMentorshipsForUser(userId: string) {
  const res = await fetch(`/api/mentorships?mentee=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch mentorships");
  }

  return res.json();
}

export async function getMenteesForUser(userId: string) {
  const res = await fetch(`/api/mentorships?mentor=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch mentees");
  }

  return res.json();
}


export async function getUserNameById( userId: string ) {

  const res = await fetch(`/api/users?id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return await res.json().then((data) => {
    return data.name;
  });

}

export async function getUserRoleById(  userId: string ) {

  const res = await fetch(`/api/users?id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return await res.json().then((data) => {
    return data.role;
  });

}