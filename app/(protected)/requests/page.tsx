"use client"

import React, { useState, useEffect } from 'react'
import { getMentorshipRequestsRecieved } from '@/app/(services)/requests'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RequestsPage () {
  const [activeTab, setActiveTab] = useState('membership');
  const [activeSubTab, setActiveSubTab] = useState('pending');
  const [mentorshipRequestsRecieved, setMentorshipRequestsRecieved] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await getMentorshipRequestsRecieved();
      setMentorshipRequestsRecieved(requests);
    };

    fetchRequests();
  }, []);

  const mentorshipRequestsSent = [ 
    {
      userToId: 'mentor1',
      userFromId: 'pending'
    }, {
      userToId: 'mentor2',
      userFromId: 'mentor5'
    }, {
      userToId: 'mentor3',
      userFromId: 'mentor9'
    }
  ];

  const renderRequests = (requests) => {
    return requests.map((request, index) => (
      <Card key={index} className="w-full m-2 p-4 border rounded-lg shadow-sm">
        <CardHeader className="flex items-center space-x-4">
          <img src="/images/IMG_5219.jpg" alt="Profile" className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{request.userFromId}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Title: MTS-3</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end space-x-2 mt-4">
          {activeSubTab === 'pending' && (
            <>
              <Button className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700">Accept</Button>
              <Button className="bg-red-600 text-white py-1 px-4 rounded hover:bg-red-700">Reject</Button>
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
              {renderRequests(mentorshipRequestsRecieved)}
            </div>
          </div>
        )}
        {activeTab === 'project' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Requests {activeSubTab === 'pending' ? 'Pending' : 'Done'}:</h2>
            <div className="grid gap-6">
              {/* Render project requests here */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}