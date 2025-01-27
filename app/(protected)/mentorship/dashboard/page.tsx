"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function MentorshipDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("ongoing");

  const ongoingMentorships = [
    {
      _id: "1",
      name: "Frontend Development Mentorship",
      description: "Mentoring on advanced frontend development techniques",
      mentor: "John Doe",
      mentee: "Jane Smith",
      progress: 75,
      status: "Active",
    },
    {
      _id: "2",
      name: "Backend Development Mentorship",
      description: "Mentoring on backend development with Node.js",
      mentor: "Alice Johnson",
      mentee: "Bob Brown",
      progress: 50,
      status: "Active",
    },
  ];

  const mentees = [
    {
      _id: "1",
      name: "Jane Smith",
      description: "Learning advanced frontend development techniques",
      mentor: "John Doe",
      progress: 75,
      status: "Active",
    },
    {
      _id: "2",
      name: "Bob Brown",
      description: "Learning backend development with Node.js",
      mentor: "Alice Johnson",
      progress: 50,
      status: "Active",
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mentorship Dashboard</h2>
          <p className="text-muted-foreground">Manage and explore your mentorships</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            className={`px-4 py-2 ${activeTab === "ongoing" ? "bg-primary text-white" : "bg-muted-foreground text-muted"}`}
            onClick={() => handleTabChange("ongoing")}
          >
            Ongoing Mentorships
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "mentees" ? "bg-primary text-white" : "bg-muted-foreground text-muted"}`}
            onClick={() => handleTabChange("mentees")}
          >
            Mentees
          </button>
        </div>

        {activeTab === "ongoing" && (
          <div className="grid gap-6">
            {ongoingMentorships.map((mentorship) => (
              <Card key={mentorship._id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{mentorship.name}</CardTitle>
                      <CardDescription>{mentorship.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{mentorship.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Mentor: {mentorship.mentor}</p>
                      <p className="text-sm font-medium">Mentee: {mentorship.mentee}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{mentorship.progress}%</p>
                      </div>
                      <Progress value={mentorship.progress} className="bg-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "mentees" && (
          <div className="grid gap-6">
            {mentees.map((mentee) => (
              <Card key={mentee._id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{mentee.name}</CardTitle>
                      <CardDescription>{mentee.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{mentee.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Mentor: {mentee.mentor}</p>
                      <p className="text-sm font-medium">Mentee: {mentee.name}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{mentee.progress}%</p>
                      </div>
                      <Progress value={mentee.progress} className="bg-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
