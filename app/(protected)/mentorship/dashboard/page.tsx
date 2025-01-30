"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getMentorshipsForUser,
  getMenteesForUser,
  getUserById,
} from "@/app/(services)/users";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FilterTabs } from "@/components/filter-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function MentorshipDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>("Ongoing");
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [mentees, setMentees] = useState<any[]>([]);
  const router = useRouter();

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
            const menteeData = await getUserById(mentee.mentee);
            return {
              ...mentee,
              menteeName: menteeData?.user.name,
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

  console.log("mentees - ", mentees);
  console.log("mentorships - ", mentorships);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Mentorship Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage and explore your mentorships
          </p>
        </div>
        <div>
          <FilterTabs
            options={["Ongoing", "Mentees"]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* <div className="space-y-6">
        {activeTab === "Ongoing" && (
          <div className="grid gap-6">
            {mentorships.map((mentorship) => (
              <Card
                key={mentorship._id}
                className="w-full max-w-[375px] flex flex-col justify-between border border-black"
                onClick={() => router.push(`/mentorship/${mentorship._id}`)}
              >
                <CardHeader className="gap-2">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-14 w-14 border-2 border-[#CFFAFE]">
                      <AvatarFallback>{mentorship.mentorName[0]}</AvatarFallback>
                      <AvatarImage src={mentorship.mentorImage} alt={mentorship.mentorName} />
                    </Avatar>
                    <div className="flex flex-col items-start justify-start gap-2 h-full">
                      <CardTitle>{mentorship.name}</CardTitle>
                      <CardDescription>{mentorship.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-start flex-wrap">
                    <Badge variant="outline">{mentorship.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col mt-auto">
                  <Label className="mb-2">Progress</Label>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-sm font-medium">{mentorship.progress}%</p>
                  </div>
                  <Progress value={mentorship.progress} className="bg-secondary" />
                </CardContent>
                <CardFooter className="flex justify-between w-full">
                  <Button className="w-full bg-purple-500 text-white">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "Mentees" && (
          <div className="grid gap-6">
            {mentees.map((mentee) => (
              <Card
                key={mentee._id}
                className="w-full max-w-[375px] flex flex-col justify-between border border-black"
                onClick={() => router.push(`/mentorship/${mentee._id}`)}
              >
                <CardHeader className="gap-2">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-14 w-14 border-2 border-[#CFFAFE]">
                      <AvatarFallback>{mentee.name[0]}</AvatarFallback>
                      <AvatarImage src={mentee.menteeImage} alt={mentee.menteeName} />
                    </Avatar>
                    <div className="flex flex-col items-start justify-start gap-2 h-full">
                      <CardTitle>{mentee.name}</CardTitle>
                      <CardDescription>{mentee.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-start flex-wrap">
                    <Badge variant="outline">{mentee.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col mt-auto">
                  <Label className="mb-2">Progress</Label>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-sm font-medium">{mentee.progress}%</p>
                  </div>
                  <Progress value={mentee.progress} className="bg-secondary" />
                </CardContent>
                <CardFooter className="flex justify-between w-full">
                  <Button className="w-full bg-purple-500 text-white">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}
