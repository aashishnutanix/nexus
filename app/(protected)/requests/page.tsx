"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getRequests,
  updateRequestStatus,
  createRequest,
  addContributorProjectMapping,
  addContributorMentorshipMapping,
  getPendingRequest,
  getPendingRequests,
  createMentorshipFromRequest,
} from "@/app/(services)/requests";
import {
  getUserById,
  getUserByIds,
  getUserNameById,
  getUserRoleById,
} from "@/app/(services)/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { ObjectId } from "mongodb";
import { RequestCard } from "./request-card";
import { RequestContextEnum, User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { isEmpty, set } from "lodash";

interface Request {
  _id: string;
  userToId: ObjectId;
  userFromId: ObjectId;
  context: "PROJECT" | "MENTORSHIP" | "FEATURE";
  referenceId: ObjectId;
  message: string;
  skillId: ObjectId;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string; // ISO string
  updatedAt: string;
}

const REQUEST_HEADING = {
  mentorship: "Mentorship Requests",
  project: "Project Requests",
};

const REQUEST_CONTEXT = {
  mentorship: "MENTORSHIP",
  project: "PROJECT",
};

export default function RequestsPage() {
  const [activeMainTab, setActiveMainTab] = useState("received");
  const [activeTab, setActiveTab] = useState("mentorship");
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const tabRef = React.createRef<HTMLDivElement>();

  async function fetchRequests() {
    const data = await getRequests();
    const requests: Request[] = data.requests;
    const userIds: Set<ObjectId> = new Set(requests.map((request) => request.userFromId))
    requests.map((request) => request.userToId).forEach((id) => userIds.add(id));
    let userDetails = await getUserByIds(Array.from(userIds));
    let usersMap = userDetails?.users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});
    return { requests, users: usersMap };
  }

  const { data, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
  });

  const requests = data?.requests || [];
  const users = data?.users || {};

  useEffect(() => {
    if (tabRef.current) {
      console.log("tabRef.current --> ", tabRef.current.attributes);
    }
  }, [tabRef]);

  const handleUpdate = async (
    request: Request,
    status: "Accepted" | "Rejected"
  ) => {
    const { _id, context } = request;
    await updateRequestStatus(_id, status);

    let contributorMapping = {
      contributorId: request.userFromId,
      status: "active",
      startDate: new Date().toISOString(),
    };
    if (context === "MENTORSHIP") {
      await createMentorshipFromRequest(request);
    } else {
      await addContributorProjectMapping({
        ...contributorMapping,
        projectId: request.referenceId,
      });
    }
    fetchRequests();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderTabContent = () => {

    return RequestContextEnum.options.map( ( context ) => {

      if(activeMainTab === "received") {
        return (
          <TabsContent
            key={context}
            value={context}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center"
          >
            {requests
              .filter((request) => request.context === context  && request.userToId === currentUserId && request.status === "Pending" )
              .map((request) => {
                if (request?.userFromId && users[request?.userFromId.toString()]) {
                  return (
                    <RequestCard
                      key={request?._id}
                      profile={users[request?.userFromId?.toString()]}
                      request={request}
                      acceptVisible={true}
                      onAccept={() => handleUpdate(request, "Accepted")}
                      onReject={() => handleUpdate(request, "Rejected")}
                    />
                  );
                }
                return null;
              })}
          </TabsContent>
        );
        
      } else {
        return (
          <TabsContent
            key={context}
            value={context}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center"
          >
            {requests
              .filter((request) => request.context === context  && request.userFromId === currentUserId && request.status === "Pending" )
              .map((request) => {
                if (request?.userToId && users[request?.userToId.toString()]) {
                  return (
                    <RequestCard
                      key={request?._id}
                      profile={users[request?.userToId?.toString()]}
                      request={request}
                      acceptVisible={false}
                    />
                  );
                }
                return null;
              })}
          </TabsContent>
        );
      }
    } )
  }

  const renderUI = () => (
    <Tabs ref={tabRef} defaultValue="PROJECT" className="space-y-6">
      <TabsList>
        <TabsTrigger value="PROJECT">Projects</TabsTrigger>
        <TabsTrigger value="MENTORSHIP">Mentorships</TabsTrigger>
        <TabsTrigger value="FEATURE">Features</TabsTrigger>
      </TabsList>
        {renderTabContent()}
    </Tabs>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between space-y-1">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground">
            Manage your project and mentorship requests.
          </p>
        </div>
        <div className="flex" >
          <Tabs onValueChange={ (value)=> setActiveMainTab(value) } value={activeMainTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      {!isEmpty(requests) ? (
        renderUI()
      ) : (
        <p>No Requests pending</p>
      )}
    </div>
  );
}
