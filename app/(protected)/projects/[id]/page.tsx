"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get } from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddRequestForm } from "@/components/request-form";
import { upVote } from "@/app/(services)/upvotes";
import { RequestContextEnum, UpVoteType } from "@/lib/types";
import { Project, Feature } from "@/lib/db/schema";
import FeaturesList from "@/app/(protected)/projects/featuresList";
import { AddFeatureForm } from "@/components/add-feature-form";
import InviteUsers from "@/components/invite-users"; // Import InviteUsers component
import { searchAllUsers } from "@/app/(services)/searchMentors"; // Import searchAllUsers method
import { createRequest } from "@/app/(services)/requests";

interface CreateRequestResponse {
  success: boolean;
  id: string; // Adjust this based on your actual response structure
}

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id || "1";
  const { data: session } = useSession();
  const { user: loggedInUser } = session || {};
  const [requestModal, setRequestModal] = useState(false);
  const [featureModal, setFeatureModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false); // State for invite modal
  const [inviteMessage, setInviteMessage] = useState(""); // State for invite message
  const queryClient = useQueryClient();

  const { data: projectData = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-project-by-id", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects?id=${projectId}`);
      return res.json();
    },
  });

  const mutation = useMutation<any, unknown, UpVoteType>({
    mutationFn: upVote,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-all-projects"] });
    },
  });

  

    const mutationOfRequest = useMutation<CreateRequestResponse, Error, any>({
      mutationFn: createRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["fetch-project-by-id"] });
      },
    });

  const handleUpvote = (upvoteData: UpVoteType) => {
    mutation.mutate(upvoteData);
  };

  const handleInviteSubmit = (selectedUsers: string[], inviteMessage: string) => {
    // Logic to save multiple requests in requests schema
    interface InviteRequest {
      message: string;
      context: string;
      referenceId: string;
      userIds: string[];
    }

      const requests: InviteRequest & { refreferenceId: string } = {
        message: inviteMessage,
        context: RequestContextEnum.enum.PROJECT,
        referenceId: projectId,
        userIds: selectedUsers,
        refreferenceId: projectId,
      };

      console.log("submitting data", requests);
      mutation.mutate(requests);

    };

  const canContribute = (project: any) => {
    return (
      project.open && loggedInUser && loggedInUser.id !== project.createdBy
    );
  };

  const canUpvote = (project: any) => {
    const projectUpvotes = upVoteMapByProjectId[project._id];
    return (
      projectUpvotes &&
      loggedInUser &&
      projectUpvotes.find((upvote: any) => upvote.userId === loggedInUser.id)
    );
  };

  const canRequestForContribution = (project: any) => {
    const projectRequests = requestsMapByProjectId[project._id];
    return (
      projectRequests &&
      loggedInUser &&
      projectRequests.find(
        (request: any) => request.userFromId === loggedInUser.id
      )
    );
  };

  const project: Project = get(projectData, "project", null);
  const skillsIdMap = get(projectData, "skillsIdMap", {});
  const usersIdMap = get(projectData, "usersIdMap", {});
  const requestsMapByProjectId = get(projectData, "requestsMapByProjectId", {});
  const upVoteMapByProjectId = get(projectData, "upVoteMapByProjectId", {});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  console.log("project", project);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            <Badge
              variant={project.businessCritical ? "destructive" : "secondary"}
            >
              {project.businessCritical ? "Business Critical" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Created By: {usersIdMap[project.createdBy.toString()]?.name}
              </p>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Tech Stack:</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech: any) => (
                  <Badge
                    key={skillsIdMap[tech]?._id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                  >
                    {skillsIdMap[tech]?.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Contributors:</p>
              <div className="flex flex-wrap gap-2">
                {project.members.map((member: any) => (
                  <div key={member.userId} className="p-2 border rounded">
                    <p className="font-medium">
                      {usersIdMap[member.userId]?.name || member.userId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Role: {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <FeaturesList features={project.features} skillsIdMap={skillsIdMap} projectId={projectId} />
            {canContribute(project) && (
              <Dialog open={requestModal} onOpenChange={setRequestModal}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    disabled={canRequestForContribution(project)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Contribute
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      Apply for contribution In {project.name} (X% bandwidth per week)
                    </DialogTitle>
                    <DialogDescription>
                      Request will go to project owner{" "}
                      <b>{usersIdMap[project.createdBy.toString()]?.name}</b>
                    </DialogDescription>
                  </DialogHeader>
                  <AddRequestForm
                    onSuccess={() => setRequestModal(false)}
                    context={RequestContextEnum.enum.PROJECT}
                    referenceId={project._id}
                    userToId={project.createdBy}
                  />
                </DialogContent>
              </Dialog>
            )}
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() =>
                handleUpvote({
                  refreferenceId: project._id.toString(),
                  context: RequestContextEnum.enum.PROJECT,
                })
              }
              disabled={canUpvote(project)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Upvote - {upVoteMapByProjectId[project._id.toString()]?.length}
            </Button>
            <InviteUsers
              projectId={projectId}
              projectName={project.name}
              usersIdMap={usersIdMap}
              onInviteSubmit={handleInviteSubmit}
            />
            <Dialog open={featureModal} onOpenChange={setFeatureModal}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Feature</DialogTitle>
                  <DialogDescription>
                    Fill in the feature details below to add a new feature.
                  </DialogDescription>
                </DialogHeader>
                <AddFeatureForm projectId={project._id.toString()} onSuccess={() => setFeatureModal(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
