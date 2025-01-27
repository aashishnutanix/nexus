"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getMentorshipsForUser, getMenteesForUser, getUserById } from "@/app/(services)/users";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MentorshipDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>("ongoing");
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [mentees, setMentees] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      getMentorshipsForUser(session.user.id).then(async (mentorships) => {
        const mentorshipsWithNames = await Promise.all(
          mentorships.map(async (mentorship) => {
            const mentorData = await getUserById(mentorship.mentor);
            const menteeData = await getUserById(mentorship.mentee);
            return {
              ...mentorship,
              mentorName: mentorData?.user.name,
              menteeName: menteeData?.user.name,
            };
          })
        );
        setMentorships(mentorshipsWithNames);
      });

      getMenteesForUser(session.user.id).then(async (mentees) => {
        const menteesWithNames = await Promise.all(
          mentees.map(async (mentee) => {
            const mentorData = await getUserById(mentee.mentor);
            return {
              ...mentee,
              mentorName: mentorData?.user.name,
            };
          })
        );
        setMentees(menteesWithNames);
      });
    }
  }, [session]);

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
            {mentorships.map((mentorship) => (
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
                      <p className="text-sm font-medium">
                        Mentor: <Link href={`/profile/${mentorship.mentor}`}>{mentorship.mentorName}</Link>
                      </p>
                      <p className="text-sm font-medium">
                        Mentee: <Link href={`/profile/${mentorship.mentee}`}>{mentorship.menteeName}</Link>
                      </p>
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
                      <p className="text-sm font-medium">
                        Mentor: <Link href={`/profile/${mentee.mentor}`}>{mentee.mentorName}</Link>
                      </p>
                      {/* <p className="text-sm font-medium">
                        Mentee: <Link href={`/profile/${mentee._id}`}>{mentee.name}</Link>
                      </p> */}
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
