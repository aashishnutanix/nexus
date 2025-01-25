"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddProjectForm } from "@/components/add-project-form"

export default function ViewProjectsPage() {
  const [open, setOpen] = useState(false)
  
  // Mock data for user's projects
  const userProjects = [
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

  const availableProjects = [
    {
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
    },
    {
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
        "Firebase"
      ]
    },
    {
      name: "Data Analytics Platform",
      description: "Building a real-time analytics dashboard",
      team: ["Frontend", "Data Engineering"],
      openRoles: ["Data Engineer", "Frontend Developer"],
      status: "Planning",
      progress: 15,
      priority: "Medium",
      techStack: [
        "Python",
        "React",
        "Apache Kafka",
        "Elasticsearch",
        "AWS"
      ]
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with Add Project button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage and explore projects
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

      {/* User's Projects Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">Your Projects</h3>
        <div className="grid gap-6">
          {userProjects.map((project, i) => (
            <Card key={i} className="border-l-4 border-l-primary">
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
                      <Progress value={project.progress} className="bg-secondary" />
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

      {/* Available Projects Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">Available Projects</h3>
        <div className="grid gap-6">
          {availableProjects.map((project, i) => (
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
                      <p className="text-sm font-medium">Status: {project.status}</p>
                      <p className="text-sm text-muted-foreground">{project.progress}% Complete</p>
                    </div>
                    <Progress value={project.progress} className="bg-secondary" />
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
                        <Badge key={i} variant="secondary" className="bg-green-100 hover:bg-green-200 text-green-800">
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
  )
}