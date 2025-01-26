"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ViewProjectsPage() {
  const router = useRouter();

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
      techStack: ["Java", "Spring Boot", "Docker", "Kubernetes", "Redis"],
    },
    {
      id: "4",
      name: "Mobile App Development",
      description: "Creating a cross-platform mobile application",
      team: ["Mobile", "Backend", "QA"],
      openRoles: ["React Native Developer", "QA Engineer"],
      status: "Starting",
      progress: 10,
      priority: "High",
      techStack: [
        "React Native",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Firebase",
      ],
    },
    {
      id: "5",
      name: "Data Analytics Platform",
      description: "Building a real-time analytics dashboard",
      team: ["Frontend", "Data Engineering"],
      openRoles: ["Data Engineer", "Frontend Developer"],
      status: "Planning",
      progress: 15,
      priority: "Medium",
      techStack: ["Python", "React", "Apache Kafka", "Elasticsearch", "AWS"],
    },
  ];

  const handleCardClick = (id: string) => {
    router.push(`/projects/${id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with Add Project button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and explore projects</p>
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
