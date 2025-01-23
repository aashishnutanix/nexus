"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, X, Pencil, Check } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [profile, setProfile] = useState({
    name: "John Doe",
    role: "Senior Software Engineer",
    email: "john.doe@example.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "System Design"],
    interests: ["Machine Learning", "Blockchain", "Cloud Architecture"],
    bio: "Passionate about building scalable systems and mentoring others in software development.",
    mentoring: [
      {
        name: "Alex Chen",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        focus: "Frontend Development",
        progress: 65,
        skills: ["React", "JavaScript", "Frontend Testing"]
      },
      {
        name: "Sarah Kim",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        focus: "React Development",
        progress: 40,
        skills: ["React", "TypeScript", "Testing"]
      }
    ],
    mentors: [
      {
        name: "Michael Brown",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        focus: "System Architecture",
        skills: ["System Design", "Cloud Architecture", "Microservices"]
      }
    ],
    projects: [
      {
        name: "E-commerce Platform Redesign",
        role: "Tech Lead",
        status: "In Progress",
        progress: 65,
        techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"]
      },
      {
        name: "Authentication Service",
        role: "Senior Developer",
        status: "Completed",
        progress: 100,
        techStack: ["Node.js", "JWT", "Redis", "MongoDB"]
      }
    ]
  })

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.image} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-bold"
                    />
                    <Input
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    />
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      type="email"
                    />
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription>{profile.role}</CardDescription>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <p className="text-sm mt-2">{profile.bio}</p>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Skills</h3>
                {isEditing && (
                  <div className="flex-1 ml-4">
                    <Input
                      placeholder="Add a skill (press Enter)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Learning Interests</h3>
                {isEditing && (
                  <div className="flex-1 ml-4">
                    <Input
                      placeholder="Add an interest (press Enter)"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={handleAddInterest}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <Badge key={i} variant="outline">
                    {interest}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mentoring</CardTitle>
            <CardDescription>People you are currently mentoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.mentoring.map((mentee, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentee.image} />
                    <AvatarFallback>{mentee.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mentee.name}</p>
                    <p className="text-sm text-muted-foreground">{mentee.focus}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentee.skills.map((skill, j) => (
                    <Badge key={j} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Mentors</CardTitle>
            <CardDescription>People who are mentoring you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.mentors.map((mentor, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentor.image} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mentor.name}</p>
                    <p className="text-sm text-muted-foreground">{mentor.focus}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill, j) => (
                    <Badge key={j} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Current and past projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profile.projects.map((project, i) => (
              <div key={i} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge variant={project.status === "Completed" ? "secondary" : "outline"}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.role}</p>
                </div>
                {project.status === "In Progress" && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, j) => (
                    <Badge key={j} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}