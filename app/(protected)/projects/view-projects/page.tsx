"use client";

import { get } from "lodash";
import { useQuery } from "@tanstack/react-query";
import ProjectsPage from "@/app/(protected)/projects/projectList";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ViewProjectsPage() {
  const { data: fetchedProjects = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-all-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects?onlyMyProjects=false");
      return res.json();
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const allProjects = get(fetchedProjects, "projects", []);
  const skillsIdMap = get(fetchedProjects, "skillsIdMap", {});
  const usersIdMap = get(fetchedProjects, "usersIdMap", {});
  const requestsMapByProjectId = get(
    fetchedProjects,
    "requestsMapByProjectId",
    {}
  );
  const upVoteMapByProjectId = get(fetchedProjects, "upVoteMapByProjectId", {});

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with Add Project button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and explore projects</p>
        </div>
      </div>

      {/* User's Projects Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">Your Projects</h3>
        <div className="grid gap-6">
          <ProjectsPage
            projects={allProjects}
            skillsIdMap={skillsIdMap}
            usersIdMap={usersIdMap}
            requestsMapByProjectId={requestsMapByProjectId}
            upVoteMapByProjectId={upVoteMapByProjectId}
          />
        </div>
      </div>
    </div>
  );
}
