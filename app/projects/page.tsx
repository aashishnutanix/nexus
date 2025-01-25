import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProjectsPage() {
  const projects = [
    {
      name: "E-commerce Platform Redesign",
      description: "Modernizing the user interface and improving user experience",
      status: "In Progress",
      progress: 65,
      team: ["Frontend", "UX Design", "Backend"],
      priority: "High",
      techStack: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "AWS"
      ]
    },
    {
      name: "API Gateway Implementation",
      description: "Setting up a centralized API gateway for microservices",
      status: "Planning",
      progress: 25,
      team: ["Backend", "DevOps"],
      priority: "Medium",
      techStack: [
        "Java",
        "Spring Boot",
        "Docker",
        "Kubernetes",
        "Redis"
      ]
    },
    {
      name: "Mobile App Development",
      description: "Creating a cross-platform mobile application",
      status: "Starting",
      progress: 10,
      team: ["Mobile", "Backend", "QA"],
      priority: "High",
      techStack: [
        "React Native",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Firebase"
      ]
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Project Rotations</h2>
        <p className="text-muted-foreground">
          Track and manage ongoing projects
        </p>
      </div>
      
      <div className="grid gap-6">
        {projects.map((project, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={project.priority === "High" ? "destructive" : "secondary"}>
                  {project.priority} Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{project.status}</p>
                    <p className="text-sm text-muted-foreground">{project.progress}%</p>
                  </div>
                  <Progress value={project.progress} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Team Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.team.map((role, i) => (
                      <Badge key={i} variant="outline">{role}</Badge>
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
  )
}