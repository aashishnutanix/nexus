"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CircleCheckBig, CircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProjectType,
  RequestContextEnum,
  UpVoteType,
  ProjectStatusType,
  ProjectStatusEnum,
  UserType,
  FeatureType,
  SkillType,
} from "@/lib/types";
import { upVote } from "@/app/(services)/upvotes";
import { createRequest } from "@/app/(services)/requests";
import { get } from "lodash";
import { LoadingSpinner } from "@/components/loading-spinner";
import { CalendarIcon, ClockIcon, Link2Icon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFeatureForm } from "@/components/add-feature-form";
import { start } from "node:repl";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AddRequestForm } from "@/components/request-form";
import { cn } from "@/lib/utils";
import Tile from "@/components/tile";
import { FeedbackCard } from "@/components/feedback-card";
import { TooltipWrapper } from "@/components/tooltip-wrapper";

interface ProjectHeaderProps {
  title: string;
  description: string;
  businessCritical: boolean;
  status: ProjectStatusType;
}

interface ProjectMetaProps {
  createdBy: string;
  startDate: string;
  duration: string;
  links: Array<{ title: string; url: string }>;
}

interface TeamSectionProps {
  label: string;
  members: UserType[];
  router: any;
}

interface TechStackProps {
  label: string;
  technologies: string[];
}

interface CreateRequestResponse {
  success: boolean;
  id: string; // Adjust this based on your actual response structure
}

export default function ProjectPageNew() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const addFeatureRef = React.useRef<HTMLDivElement>(null);

  const [requestModal, setRequestModal] = useState(false);
  const [featureModal, setFeatureModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false); // State for invite modal
  const [inviteMessage, setInviteMessage] = useState(""); // State for invite message

  useEffect(() => {
    if (addFeatureRef?.current) {
      console.log("addFeatureRef.current  ---> ", addFeatureRef?.current);
    }
  }, [addFeatureRef]);

  const projectId = params?.id || "1";
  const { user: loggedInUser } = session || {};

  const { data: projectData = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-project-by-id", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects?id=${projectId}`);
      return res.json();
    },
  });

  const isOwner = loggedInUser?.id === projectData?.project?.createdBy;

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

  const handleInviteSubmit = (
    selectedUsers: string[],
    inviteMessage: string
  ) => {
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

  const project: ProjectType = get(projectData, "project", null);
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

  const teamMembers = project.members.map(
    (member) => usersIdMap[member.userId]
  );

  const feedbacks = Array(6).fill({
    date: new Date("2024-01-14"),
    message:
      "I believe I would be able to extend my expertise in Generative AI for this project. This aligns with my aspirations.",
    rating: 4,
    provider: {
      name: "Daniel Smith",
      role: "Senior Staff Engineer",
    },
  });

  const features = project.features?.map((feature: FeatureType) => ({
    name: feature.name,
    projectId: feature.projectId,
    bandwidthRequiredForContribution: feature.bandwidthRequiredForContribution,
    description: feature.description,
    priority: feature.priority,
    taskCount: 12,
    status: feature.status,
    startDate: feature.startDate
      ? format(new Date(feature.startDate), "MMM dd, yyyy")
      : "Invalid Date",
    timeline: {
      value: feature.timeline.value,
      type: feature.timeline.type,
    },
    techStack: feature.techStack?.map(
      (tech: string) => skillsIdMap[tech]?.name
    ),
    links: feature.links,
  }));

  return (
    <div className="container mx-auto p-6 space-y-8">
      <ProjectHeader
        title={project.name}
        description={project.description}
        businessCritical={project.businessCritical}
        status={project.status}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ProjectMeta
          createdBy={usersIdMap[project.createdBy].name}
          startDate={format(new Date(project.startDate), "MMM dd, yyyy")}
          duration="6 Months"
          links={[
            { title: "Jira", url: "#" },
            { title: "BRD", url: "#" },
          ]}
        />

        <div className="space-y-4">
          <TeamSection label="Team" members={teamMembers} router={router} />
          <TechStack
            label="Tech Stack"
            technologies={project.techStack.map(
              (tech) => skillsIdMap[tech].name
            )}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Tabs ref={addFeatureRef} defaultValue="features">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            <Dialog open={featureModal} onOpenChange={setFeatureModal}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
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
                <AddFeatureForm
                  projectId={project._id.toString()}
                  onSuccess={() => setFeatureModal(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="features" className="mt-6">
            {features?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {features?.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    feature={feature}
                    projectId={projectId}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No Features yet
              </div>
            )}
          </TabsContent>
          <TabsContent value="feedback">
            {feedbacks?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {feedbacks?.map((feedback, index) => (
                  <FeedbackCard key={index} feedback={feedback} />
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No feedback yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  feature: FeatureType;
  projectId: string;
  isOwner: boolean;
}

export function FeatureCard({ feature, projectId, isOwner }: FeatureCardProps) {
  const {
    name,
    description,
    upvote,
    status,
    timeline,
    techStack = [],
    links,
    priority,
    startDate,
  } = feature;
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(
    null
  );

  const canRequestForContribution = (feature: FeatureType) => {
    // Add your logic to determine if the user can request for contribution to the feature
    return false; // Placeholder
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CircleIcon className="h-4 w-4" />
          <span>({upvote || 0})</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col mt-auto">
        <Tile
          value={status}
          visible={!!status}
          bgColor="#FFF8E6"
          textColor="#B98900"
          className="w-fit"
        />
        <br />
        <Label className="mb-2">TECH STACK</Label>
        <div className="flex flex-wrap gap-2">
          {techStack.map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center w-full gap-2">
        {isOwner && (
          <>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setEditModalIsOpen(true)}
            >
              Edit
            </Button>
            <Button className="w-full" variant="outline">
              Invite
            </Button>
          </>
        )}
        <Dialog
          open={editModalIsOpen}
          onOpenChange={() => setEditModalIsOpen(false)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Feature</DialogTitle>
              <DialogDescription>
                Update the feature details below.
              </DialogDescription>
            </DialogHeader>
            <AddFeatureForm
              projectId={projectId}
              // @ts-ignore
              feature={feature}
              onSuccess={() => setEditModalIsOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {!isOwner && (
          <Dialog open={requestModal} onOpenChange={setRequestModal}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  "w-full gap-2",
                  canRequestForContribution(feature) &&
                    "bg-[#BBF7D0] text=[#166534] opacity-100"
                )}
                variant="outline"
                disabled={canRequestForContribution(feature)}
                onClick={() => {
                  setSelectedFeature(feature);
                  setRequestModal(true);
                }}
              >
                {canRequestForContribution(feature) && (
                  <CircleCheckBig size={16} />
                )}
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  Apply for contribution In {feature.name}
                </DialogTitle>
                <DialogDescription>
                  Request will go to project owner
                </DialogDescription>
              </DialogHeader>
              <AddRequestForm
                onSuccess={() => setRequestModal(false)}
                context="FEATURE"
                referenceId={feature._id}
                userToId={feature.projectId}
              />
            </DialogContent>
          </Dialog>
        )}
        <Button className="w-full" variant="outline">
          Upvote
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProjectHeader({
  title,
  description,
  businessCritical,
  status,
}: ProjectHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="flex gap-2">
          <Tile
            value={status}
            visible={!!status}
            bgColor="#FFF8E6"
            textColor="#B98900"
          />
          <Tile
            value={"Business Critical"}
            visible={businessCritical}
            bgColor="#FFE9E9"
            textColor="#D92D20"
          />
        </div>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function ProjectMeta({
  createdBy,
  startDate,
  duration,
  links,
}: ProjectMetaProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 bg-[#F8FAFC] rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Created By</p>
          <p className="text-sm text-muted-foreground">{createdBy}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Start Date</p>
          <p className="text-sm text-muted-foreground">{startDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Estimated Duration</p>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link2Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Relevant Links</p>
          <div className="flex gap-2">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="text-sm text-blue-600 hover:underline"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamSection({ label, members, router }: TeamSectionProps) {
  return (
    <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-lg border border-gray-200 p-4">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex space-x-2">
        {[...members, ...members, ...members, ...members].map(
          (member, index, arr) => (
            <TooltipWrapper value={member.name} key={index}>
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                onHoverStart={() => {
                  if (index > 0) arr[index - 1].hovered = true;
                  if (index < arr.length - 1) arr[index + 1].hovered = true;
                }}
                onHoverEnd={() => {
                  if (index > 0) arr[index - 1].hovered = false;
                  if (index < arr.length - 1) arr[index + 1].hovered = false;
                }}
                className="relative"
              >
                <motion.div
                  animate={{ x: member.hovered ? -10 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar
                    key={index}
                    className="border-2 border-background cursor-pointer"
                    onClick={() => router.push(`/profile/${member._id}`)}
                  >
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                </motion.div>
              </motion.div>
            </TooltipWrapper>
          )
        )}
      </div>
    </div>
  );
}

export function TechStack({ label, technologies }: TechStackProps) {
  return (
    <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-lg border border-gray-200 p-4">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-[#F4F4F5] px-3 py-1 text-xs font-medium text-[#18181B]"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
