"use client"

import React, { useState, useEffect } from 'react'
import { getRequests, updateRequestStatus, createRequest } from '@/app/(services)/requests'
import { getUserById } from '@/app/(services)/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RequestsPage () {
  const [activeTab, setActiveTab] = useState('membership');
  const [activeSubTab, setActiveSubTab] = useState('pending');
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

  const handleUpdateStatus = async (id, status) => {
    await updateRequestStatus(id, status);
    setRequests(requests.map(request => request._id === id ? { ...request, status } : request));
  };

  const handleCreateRequest = async (data) => {
    const newRequest = await createRequest(data);
    setRequests([...requests, newRequest]);
  };

  const renderRequests = (requests) => {
    return requests.map((request, index) => (
      <Card key={index} className="w-full m-2 p-4 border rounded-lg shadow-sm">
        <CardHeader className="flex items-center space-x-4">
          <img src="/images/IMG_5219.jpg" alt="Profile" className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{users[request.userFromId]}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Title: MTS-3</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end space-x-2 mt-4">
          {activeSubTab === 'pending' && (
            <>
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
            </>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Requests Page</h2>
          <p className="text-muted-foreground">Manage your mentorship and project requests</p>
        </div>
      </div>
      <div className="flex mb-4">
        <Button onClick={() => setActiveTab('membership')} className={`py-2 px-4 mr-2 ${activeTab === 'membership' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Membership</Button>
        <Button onClick={() => setActiveTab('project')} className={`py-2 px-4 ${activeTab === 'project' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Project</Button>
      </div>
      <div className="flex mb-4">
        <Button onClick={() => setActiveSubTab('pending')} className={`py-2 px-4 mr-2 ${activeSubTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Pending</Button>
        <Button onClick={() => setActiveSubTab('done')} className={`py-2 px-4 ${activeSubTab === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Done</Button>
      </div>
      <div>
        {activeTab === 'membership' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mentorship Requests {activeSubTab === 'pending' ? 'Pending' : 'Done'}:</h2>
            <div className="grid gap-6">
              {renderRequests(requests.filter(request => request.context === 'MENTORSHIP'))}
            </div>
          </div>
        )}
        {activeTab === 'project' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Requests {activeSubTab === 'pending' ? 'Pending' : 'Done'}:</h2>
            <div className="grid gap-6">
              {renderRequests(requests.filter(request => request.context === 'PROJECT'))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
