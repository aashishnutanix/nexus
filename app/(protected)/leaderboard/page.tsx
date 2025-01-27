import React from 'react';
import { getTopMentors } from '@/app/(services)/leaderboard';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TopMentors  {
  _id: string;
  count: number;
}


const LeaderboardPage = async () => {

  const data = await getTopMentors();

  return (
    <div>
      <h1>Leaderboard Page</h1>
      <ul>
        {data.requests.map((request, index) => (
          <li key={index}>
            <div>ID: {request._id}</div>
            <div>Count: {request.count}</div>
            {/* Add more fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardPage;