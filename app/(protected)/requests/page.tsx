"use client"

import React, { useEffect, useState } from "react";
import { getRequests, updateRequestStatus } from "@/app/(services)/requests";
import { getUserById } from "@/app/(services)/users"; // Assuming there's a service to get user details

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    async function fetchRequests() {
      const data = await getRequests();
      setRequests(data.requests);
      const userIds = data.requests.map(request => request.userFromId);
      const userDetails = await Promise.all(userIds.map(id => getUserById(id)));
      const usersMap = userDetails.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
      }, {});
      setUsers(usersMap);
    }
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: "Accepted" | "Rejected") => {
    await updateRequestStatus(id, status);
    setRequests(requests.filter((request) => request._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        requests.map((request) => (
          <div key={request._id} className="border p-4 mb-4 rounded-lg shadow-md">
            <p className="font-semibold">Requester: {users[request.userFromId]}</p>
            <p className="text-gray-700">Context: {request.context}</p>
            <p className="text-gray-700">
              {request.context === "PROJECT"
                ? `Project: ${request.referenceId}`
                : `Skill: ${request.skills.join(", ")}`}
            </p>
            <div className="mt-4 flex items-center">
              <button
                className="bg-purple-500 text-white p-2 mr-2 rounded-full flex items-center justify-center"
                onClick={() => handleUpdateStatus(request._id, "Accepted")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                className="bg-black text-white p-2 rounded-full flex items-center justify-center"
                onClick={() => handleUpdateStatus(request._id, "Rejected")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RequestsPage;