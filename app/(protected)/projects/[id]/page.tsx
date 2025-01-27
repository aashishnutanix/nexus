"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProject } from "@/app/(services)/projects";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/LoadingSpinner";

const dummyProject = {
  name: "E-commerce Platform Redesign",
  description: "Modernizing the user interface and improving user experience",
  status: "In Progress",
  progress: 65,
  priority: "High",
  techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS"],
  team: ["Frontend", "UX Design", "Backend"],
};

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id || "1";
  console.log("projectId ->", params);
  const [project, setProject] = useState(dummyProject);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      getProject(projectId)
        .then((data) => {
          setProject(data.project || dummyProject);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch project:", error);
          setProject(dummyProject);
          setIsLoading(false);
        });
    }
  }, [projectId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <Badge
            variant={
              project.priority === "High" ? "destructive" : "secondary"
            }
          >
            {project.priority} Priority
          </Badge>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{project.status}</p>
              <p className="text-sm text-muted-foreground">
                {project.progress}%
              </p>
            </div>
            <Progress value={project.progress} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Team Roles:</h2>
            <div className="flex flex-wrap gap-2">
              {project.team.map((role, i) => (
                <Badge key={i} variant="outline">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Tech Stack:</h2>
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
      </div>
    </div>
  );
}
