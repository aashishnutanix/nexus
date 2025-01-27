"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { get } from "lodash"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddProjectForm } from "@/components/add-project-form"
import { AddRequestForm } from "@/components/request-form"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { RequestContextEnum, UpVoteType } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useState } from "react";
import { upVote } from "@/app/(services)/upvotes";

export default function ViewProjectsPage() {
    const { data: session } = useSession();
    const { user: loggedInUser } = session || {};
  const [open, setOpen] = useState(false)
  const [requestModal, setRequestModal] = useState(false)
  const router = useRouter();


  // Fetch user's projects using the getProjects service
  const queryClient = useQueryClient();

  const { data: fetchedProjects = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-all-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      return res.json();
    },
  });


  const mutation = useMutation<any, unknown, UpVoteType>({
      mutationFn: upVote,
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["fetch-all-projects"] });
      },
    });

  console.log("fetchedProjects -->>> ", fetchedProjects);
  const allProjects = get(fetchedProjects, "projects", []);
  const skillsIdMap = get(fetchedProjects, "skillsIdMap", {});
  const usersIdMap = get(fetchedProjects, "usersIdMap", {});
  const requestsMapByProjectId = get(fetchedProjects, "requestsMapByProjectId", {});
  const upVoteMapByProjectId = get(fetchedProjects, "upVoteMapByProjectId", {});
  
  const handleUpvote = (upvoteData: UpVoteType) => {
    mutation.mutate(upvoteData);
  };

  const availableProjects = [
    {
      id: "3",
      name: "API Gateway Implementation",
      description: "Setting up a centralized API gateway for microservices",
      team: ["Backend", "DevOps"],
      openRoles: ["Senior Backend Developer", "DevOps Engineer"],
      status: "Planning",
      progress: 25,
      priority: "Medium",
      techStack: [
        "Java",
        "Spring Boot",
        "Docker",
        "Kubernetes",
        "Redis"
      ]
    }
  ]

  const handleCardClick = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const canContribute = (project: any) => {
   return project.open && loggedInUser && loggedInUser.id  !== project.createdBy;
  }

  const canUpvote = (project: any) => {
    const projectUpvotes = upVoteMapByProjectId[project._id];
    return projectUpvotes && loggedInUser && projectUpvotes.find((upvote: any) => upvote.userId === loggedInUser.id);
  }

  const canRequestForContribution = (project: any) => {
    const projectRequests = requestsMapByProjectId[project._id];
    return projectRequests && loggedInUser && projectRequests.find((request: any) => request.userFromId === loggedInUser.id);
  }
  

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with Add Project button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and explore projects</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill in the project details below to create a new project.
              </DialogDescription>
            </DialogHeader>
            <AddProjectForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* User's Projects Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">Your Projects</h3>
        <div className="grid gap-6">
          {allProjects.map((project: any, i: number) => (
            <Card key={project._id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{project.name} - {project.department}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      project.businessCritical ? "destructive" : "secondary"
                    }
                  >
                    {project.businessCritical ? "Business Critical" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Created By: {usersIdMap[project.createdBy]?.name}
                    </p>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  {project.status === "In Progress" && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">
                          Progress
                        </p>
                        <p className="text-sm font-medium">
                          {project.progress}%
                        </p>
                      </div>
                      <Progress
                        value={project.progress}
                        className="bg-secondary"
                      />
                    </div>
                  )}
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
                    {canContribute(project) ? (<Dialog open={requestModal} onOpenChange={setRequestModal}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90" disabled = {canRequestForContribution(project)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Contribute
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Apply for contribution In {project.name} </DialogTitle>
                          <DialogDescription>
                            Request will go to project owner <b>{usersIdMap[project.createdBy].name}</b>
                          </DialogDescription>
                        </DialogHeader>
                        <AddRequestForm onSuccess={() => setRequestModal(false)} context={RequestContextEnum.enum.PROJECT} referenceId={project._id} userToId={project.createdBy}  />
                      </DialogContent>
                    </Dialog>):null}
                    <Button className="bg-primary hover:bg-primary/90" onClick={() => handleUpvote({refreferenceId: project._id, context: RequestContextEnum.enum.PROJECT})} disabled={canUpvote(project)} >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Upvote - {upVoteMapByProjectId[project._id]?.length}
                        </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Projects Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">
          Available Projects
        </h3>
        <div className="grid gap-6">
          {availableProjects.map((project, i) => (
            <Card
              key={i}
              className="border-l-4 border-l-primary"
              onClick={() => handleCardClick(project.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      project.priority === "High" ? "destructive" : "secondary"
                    }
                  >
                    {project.priority} Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        Status: {project.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.progress}% Complete
                      </p>
                    </div>
                    <Progress
                      value={project.progress}
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Current Team:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.team.map((role, i) => (
                        <Badge key={i} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Open Roles:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.openRoles.map((role, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-green-100 hover:bg-green-200 text-green-800"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

