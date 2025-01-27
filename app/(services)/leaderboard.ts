// Top Mentors
export async function getTopMentors( limit: number = 10, days: number = 30) {

    // request?filterBy accepted groupBy ReceieverId,sortBy MaxCount , add limit if given, if prev 30 days, prev 7 days , prev year, based on filter
    const groupBy = 'userToId'

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = new URL('/api/requests', baseUrl);
    url.searchParams.append('status', 'Accepted');
    url.searchParams.append('context', 'PROJECT');
    url.searchParams.append('period', `${days}`);
    url.searchParams.append('groupBy', groupBy);
    url.searchParams.append('sortBy', 'MaxCount');
    url.searchParams.append('limit', `${limit}`);
    
    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

  if (!res.ok) {
    throw new Error("Failed to fetch top mentors");
  }

  return res.json();


}



// Top Mentees

// Top Projects