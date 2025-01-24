import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function MentorshipPage() {
  const mentorships = [
    {
      mentor: {
        name: "Sarah Wilson",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        role: "Senior Developer",
        skills: ["React", "JavaScript", "TypeScript", "Node.js", "AWS"]
      },
      mentee: {
        name: "Alex Chen",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        role: "Junior Developer",
        interests: ["React", "JavaScript", "Frontend Testing"]
      },
      focus: "Frontend Development",
      progress: "In Progress"
    },
    {
      mentor: {
        name: "Michael Brown",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        role: "Tech Lead",
        skills: ["System Design", "Java", "Spring Boot", "Microservices", "Redis"]
      },
      mentee: {
        name: "Emily Davis",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        role: "Developer",
        interests: ["System Design", "Java", "Spring Boot"]
      },
      focus: "System Architecture",
      progress: "Starting"
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mentorship Dashboard</h2>
        <p className="text-muted-foreground">
          Manage and track mentorship relationships
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {mentorships.map((mentorship, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{mentorship.focus}</CardTitle>
              <CardDescription>Status: {mentorship.progress}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentorship.mentor.image} />
                    <AvatarFallback>{mentorship.mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{mentorship.mentor.name}</p>
                    <p className="text-sm text-muted-foreground">Mentor • {mentorship.mentor.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentorship.mentee.image} />
                    <AvatarFallback>{mentorship.mentee.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{mentorship.mentee.name}</p>
                    <p className="text-sm text-muted-foreground">Mentee • {mentorship.mentee.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Mentor Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentorship.mentor.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Mentee Learning Goals:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentorship.mentee.interests.map((interest, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer hover:bg-accent">
                        {interest}
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