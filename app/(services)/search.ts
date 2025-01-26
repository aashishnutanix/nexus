export async function search(query: string, limit: number = 10, page: number = 1) {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`, {
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
  