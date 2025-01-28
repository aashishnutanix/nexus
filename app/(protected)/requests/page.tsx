"use client"

import React, { useState, useEffect } from 'react'
import { getRequests, updateRequestStatus, createRequest, addContributorProjectMapping, addContributorMentorshipMapping, getPendingRequest, getPendingRequests, createMentorshipFromRequest } from '@/app/(services)/requests'
import { getUserById, getUserNameById, getUserRoleById } from '@/app/(services)/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { ObjectId } from 'mongodb';

interface Request {
  _id: string;
  userToId: ObjectId;
  userFromId: ObjectId;
  context: "PROJECT" | "MENTORSHIP" | "FEATURE";
  referenceId: ObjectId;
  message: string;
  skillId: ObjectId,
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string; // ISO string
  updatedAt: string; 
}

const REQUEST_HEADING = { 
  mentorship: 'Mentorship Requests',
  project: 'Project Requests'
}

const REQUEST_CONTEXT = {
  mentorship: 'MENTORSHIP',
  project: 'PROJECT'
}

export default function RequestsPage () {
  const [activeMainTab, setActiveMainTab] = useState('received');
  const [activeTab, setActiveTab] = useState('mentorship');
  const [activeSubTab, setActiveSubTab] = useState('pending');
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState({});
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  async function fetchRequests() {
    const data = await getRequests();
    setRequests(data.requests);
    const userIds = data.requests.map(request => request.userFromId);
    userIds.push(...data.requests.map(request => request.userToId));
    let userDetails = [];

    for (let i = 0; i < userIds.length; i++) {
      try{
        if(!userIds[i])
            continue;
        const user = await getUserById(userIds[i]);
        userDetails.push(user);
      } catch (error) {
        console.error("Error fetching user details", error);
      } 
    }

    const usersMap = userDetails.reduce((acc, data) => {
      acc[data.user._id] = data.user;
      return acc;
    }, {});
    setUsers(usersMap);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (request: Request, status: "Accepted" | "Rejected") => {
    const { _id, context } = request;
    await updateRequestStatus(_id, status);

    let contributorMapping = { 
      contributorId: request.userFromId,
      status: 'active',
      startDate: new Date().toISOString()
    }
    if (context === 'MENTORSHIP') {
      await createMentorshipFromRequest(request);
    } else {
      await addContributorProjectMapping({ 
        ...contributorMapping,
        projectId: request.referenceId 
      });
    } 
    fetchRequests();
  };

  const renderRequests = (requests) => {
    if(requests.length === 0) {
      return (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No requests found</p>
        </div>
      );
    }

    return requests.map((request, index) => (
      <Card key={index} className="w-full m-2 p-4 border rounded-lg shadow-sm">
        <CardHeader className="flex items-center space-x-4">
          <img src="/images/IMG_5219.jpg" alt="Profile" className="w-12 h-12 rounded-full" />
          
            {(() => {
              let requestContextUserId = ( activeMainTab === 'received' ? request.userToId : request.userFromId );
              return (
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{ users[requestContextUserId].name }</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{ users[requestContextUserId].role }</CardDescription>
                  <CardDescription className="text-sm text-muted-foreground">{ request.message }</CardDescription>
                </div>
              );
            })()}
            
        </CardHeader>
        <CardContent className="flex justify-end space-x-2 mt-4">
          {activeSubTab === 'pending' && (
            <>
              <button
                className="bg-purple-500 text-white p-2 mr-2 rounded-full flex items-center justify-center"
                onClick={() => handleUpdate(request, "Accepted")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                className="bg-black text-white p-2 rounded-full flex items-center justify-center"
                onClick={() => handleUpdate(request, "Rejected")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Requests Page</h2>
          <p className="text-muted-foreground">Manage your mentorship and project requests</p>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setActiveMainTab('received')} className={`py-2 px-4 ${activeMainTab === 'received' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Requests Received</Button>
          <Button onClick={() => setActiveMainTab('sent')} className={`py-2 px-4 ${activeMainTab === 'sent' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Requests Sent</Button>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setActiveTab('mentorship')} className={`py-2 px-4 ${activeTab === 'mentorship' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Mentorship</Button>
          <Button onClick={() => setActiveTab('project')} className={`py-2 px-4 ${activeTab === 'project' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Project</Button>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setActiveSubTab('pending')} className={`py-2 px-4 ${activeSubTab === 'pending' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Pending</Button>
          <Button onClick={() => setActiveSubTab('done')} className={`py-2 px-4 ${activeSubTab === 'done' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Done</Button>
        </div>
      </div>
      <div className="mt-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{REQUEST_HEADING[activeTab]} {activeSubTab === 'pending' ? 'Pending' : 'Done'}:</h2>
            <div className="grid gap-6">
              {renderRequests(requests.filter(request => request.context ===  REQUEST_CONTEXT[activeTab] && ( activeSubTab === 'pending' ? request.status === 'Pending': request.status != 'Pending' ) && (activeMainTab === 'received' ? request.userToId === currentUserId : request.userFromId === currentUserId)))}
            </div>
          </div>
      </div>
    </div>
  )
}
