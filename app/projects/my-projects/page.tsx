import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function MyProjectsPage() {
  const myProjects = [
    {
      name: "E-commerce Platform Redesign",
      description: "Modernizing the user interface and improving user experience",
      role: "Tech Lead",
      status: "In Progress",
      progress: 65,
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
      name: "Authentication Service",
      description: "Building a secure and scalable authentication system",
      role: "Senior Developer",
      status: "Completed",
      progress: 100,
      priority: "Medium",
      techStack: [
        "Node.js",
        "JWT",
        "Redis",
        "MongoDB"
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
        <p className="text-muted-foreground">
          Projects where you are actively involved
        </p>
      </div>
      
      <div className="grid gap-6">
        {myProjects.map((project, i) => (
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
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Role: {project.role}</p>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                {project.status === "In Progress" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-sm font-medium">{project.progress}%</p>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                )}
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