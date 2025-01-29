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
import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { isEmpty } from "lodash";

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
  // const [requests, setRequests] = useState<Request[]>([]);
  // const [users, setUsers] = useState<{ [key: string]: User }>({});
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const tabRef = React.createRef<HTMLDivElement>();

  async function fetchRequests() {
    const data = await getRequests();
    const requests: Request[] = data.requests;
    const userIds: ObjectId[] = requests.map((request) => request.userFromId);
    userIds.push(...requests.map((request) => request.userToId));
    let userDetails = [];

    for (let i = 0; i < userIds.length; i++) {
      try {
        if (!userIds[i]) continue;
        const user = await getUserById(userIds[i].toString());
        userDetails.push(user);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    }

    const usersMap = userDetails.reduce((acc, data) => {
      acc[data.user._id] = data.user;
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

  const renderUI = () => (
    <Tabs ref={tabRef} defaultValue="projects" className="space-y-6">
      <TabsList>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="mentorships">Mentorships</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
      </TabsList>
      <TabsContent
        value="projects"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center"
      >
        {requests
          .filter((request) => request.context === "PROJECT")
          .map((request) => {
            if (request?.userFromId && users[request?.userFromId.toString()]) {
              return (
                <RequestCard
                  key={request?._id}
                  profile={users[request?.userFromId?.toString()]}
                  request={request}
                  onAccept={() => handleUpdate(request, "Accepted")}
                  onReject={() => handleUpdate(request, "Rejected")}
                />
              );
            }
            return null;
          })}
      </TabsContent>
      <TabsContent
        value="mentorships"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center"
      >
        {requests
          .filter((request) => request.context === "MENTORSHIP")
          .map((request) => {
            if (request?.userFromId && users[request?.userFromId.toString()]) {
              return (
                <RequestCard
                  key={request?._id}
                  profile={users[request?.userFromId?.toString()]}
                  request={request}
                  onAccept={() => handleUpdate(request, "Accepted")}
                  onReject={() => handleUpdate(request, "Rejected")}
                />
              );
            }
            return null;
          })}
      </TabsContent>
      <TabsContent
        value="features"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center"
      >
        {requests
          .filter((request) => request.context === "FEATURE")
          .map((request) => {
            if (request?.userFromId && users[request?.userFromId.toString()]) {
              return (
                <RequestCard
                  key={request?._id}
                  profile={users[request?.userFromId?.toString()]}
                  request={request}
                  onAccept={() => handleUpdate(request, "Accepted")}
                  onReject={() => handleUpdate(request, "Rejected")}
                />
              );
            }
            return null;
          })}
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Requests</h1>
        <p className="text-muted-foreground">
          Manage your project and mentorship requests.
        </p>
      </div>
      {!isEmpty(requests) && !isEmpty(users) ? (
        renderUI()
      ) : (
        <p>No Requests pending</p>
      )}
    </div>
  );
}
