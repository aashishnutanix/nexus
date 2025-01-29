"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { get } from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";
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
import { AddProjectForm } from "@/components/add-project-form";
import ProjectsPage from "@/app/(protected)/projects/projectList";
import { upVote } from "@/app/(services)/upvotes";
import { UpVoteType } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function MyProjectsPage() {
  const [open, setOpen] = useState(false);

  const { data: fetchedProjects = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-my-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects?onlyMyProjects=true");
      return res.json();
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const myProjects = get(fetchedProjects, "projects", []);
  const skillsIdMap = get(fetchedProjects, "skillsIdMap", {});
  const usersIdMap = get(fetchedProjects, "usersIdMap", {});
  const requestsMapByProjectId = get(
    fetchedProjects,
    "requestsMapByProjectId",
    {}
  );
  const upVoteMapByProjectId = get(fetchedProjects, "upVoteMapByProjectId", {});

  console.log("myProjects -->>> ", myProjects);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
          <p className="text-muted-foreground">
            Projects where you are actively involved
          </p>
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

      <div className="grid gap-6">
        <ProjectsPage
          projects={myProjects}
          skillsIdMap={skillsIdMap}
          usersIdMap={usersIdMap}
          requestsMapByProjectId={requestsMapByProjectId}
          upVoteMapByProjectId={upVoteMapByProjectId}
        />
      </div>
    </div>
  );
}
