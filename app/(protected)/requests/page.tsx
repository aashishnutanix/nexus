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
import { RequestContextEnum, UserType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { isEmpty, set } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilterTabs } from "@/components/filter-tabs";
import { cn } from "@/lib/utils";

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
  const [activeMainTab, setActiveMainTab] = useState("Received");
  const [activeTab, setActiveTab] = useState("mentorship");
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const tabRef = React.createRef<HTMLDivElement>();

  async function fetchRequests() {
    const data = await getRequests();
    const requests: Request[] = data.requests;

    // Collect user IDs from requests
    const userIds = requests.flatMap((request) => [
      request.userFromId,
      request.userToId,
    ]);

    // Remove duplicates
    const uniqueUserIds = Array.from(
      new Set(userIds.map((id) => id.toString()))
    );

    // Fetch user details by IDs
    const userDetails = await getUserByIds(uniqueUserIds);
    const usersMap: { [key: string]: UserType } = userDetails?.users.reduce(
      (acc: { [key: string]: UserType }, user: UserType) => {
        acc[user._id.toString()] = user;
        return acc;
      },
      {}
    );

    return { requests, users: usersMap };
  }
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
  });

  const requests = data?.requests || [];
  const users = data?.users || {};

  useEffect(() => {
    console.log("Requests --> ", requests);
  }, [requests]);

  const handleUpdate = async (
    request: Request,
    profile: any,
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
      await createMentorshipFromRequest(request, profile);
    } else {
      await addContributorProjectMapping({
        ...contributorMapping,
        projectId: request.referenceId,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["requests"] });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderTabContent = () => {
    return RequestContextEnum.options.map((context) => {
      const filteredRequests = requests.filter((request) => {
        if (activeMainTab === "Received") {
          return (
            request.context === context &&
            request.userToId.toString() === currentUserId &&
            request.status === "Pending"
          );
        } else {
          return (
            request.context === context &&
            request.userFromId.toString() === currentUserId &&
            request.status === "Pending"
          );
        }
      });

      const requestCards = filteredRequests.map((request) => {
        const userId =
          activeMainTab === "Received"
            ? request.userFromId.toString()
            : request.userToId.toString();

        if (users[userId]) {
          return (
            <RequestCard
              key={request._id}
              profile={users[userId]}
              request={request}
              acceptVisible={activeMainTab === "Received"}
              onAccept={(profile) => handleUpdate(request, profile, "Accepted")}
              onReject={(profile) => handleUpdate(request, profile, "Rejected")}
            />
          );
        }
        return null;
      });

      return (
        <TabsContent
          key={context}
          value={context}
          className={cn(
            requestCards.length > 0
              ? "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 justify-items-center"
              : "flex items-center justify-center h-full"
          )}
        >
          {requestCards.length > 0 ? (
            requestCards
          ) : (
            <div className="text-center text-gray-500">
              No Requests to take action on
            </div>
          )}
        </TabsContent>
      );
    });
  };
  const renderUI = () => (
    <div className="w-full flex items-center justify-between">
      <Tabs ref={tabRef} defaultValue="PROJECT" className="space-y-6 w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList>
            <TabsTrigger value="PROJECT">Projects</TabsTrigger>
            <TabsTrigger value="MENTORSHIP">Mentorships</TabsTrigger>
            <TabsTrigger value="FEATURE">Features</TabsTrigger>
          </TabsList>
          <FilterTabs
            options={["Received", "Sent"]}
            value={activeMainTab}
            onChange={setActiveMainTab}
          />
        </div>
        {renderTabContent()}
      </Tabs>
    </div>
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
      </div>
      {!isEmpty(requests) ? renderUI() : <p>No Requests pending</p>}
    </div>
  );
}
