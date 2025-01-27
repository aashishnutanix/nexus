"use client"

import React, { useEffect, useState } from "react";
import { getRequests, updateRequestStatus } from "@/app/(services)/requests";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      const data = await getRequests();
      setRequests(data.requests);
    }
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: "Accepted" | "Rejected") => {
    await updateRequestStatus(id, status);
    setRequests(requests.filter((request) => request._id !== id));
  };

  return (
    <div>
      <h1>Requests</h1>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((request) => (
          <div key={request._id} className="border p-4 mb-4">
            <p>Requester: {request.userFromId}</p>
            <p>Context: {request.context}</p>
            <p>
              {request.context === "PROJECT"
                ? `Project: ${request.referenceId}`
                : `Skill: ${request.skills.join(", ")}`}
            </p>
            <button
              className="bg-green-500 text-white px-4 py-2 mr-2"
              onClick={() => handleUpdateStatus(request._id, "Accepted")}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2"
              onClick={() => handleUpdateStatus(request._id, "Rejected")}
            >
              Decline
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RequestsPage;