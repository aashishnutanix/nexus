export async function searchMentors(query: string, limit: number = 10, page: number = 1, currentUserId: string) {
  const res = await fetch(`/api/search/mentor?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}&currentUserId=${currentUserId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to perform search");
  }

  return res.json();
}


export async function searchAllUsers(query: string, limit: number = 10, page: number = 1, currentUserId: string) {
  const res = await fetch(`/api/search/users?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}&currentUserId=${currentUserId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to perform search");
  }

  return res.json();
}
