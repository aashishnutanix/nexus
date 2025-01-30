"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  GitPullRequest,
  Trophy,
  Blocks,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { getRecentProjects } from "@/app/(services)/projects";
import { useState, useEffect } from "react";
import { Project } from "@/lib/db/schema";

import Link from "next/link";
import { format } from "date-fns";

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]); // State to hold the fetched projects
  const [loading, setLoading] = useState(true); // Loading state to handle UI during fetch

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchRecentProjects = async () => {
      try {
        const res = await getRecentProjects(); // Await the async function
        const { success, projects } = res;
        console.log("Recent Projects Fetched From Service-> ", recentProjects);
        setRecentProjects(projects); // Set the state with fetched data
      } catch (error) {
        console.error("Error fetching projects:", error); // Error handling
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };
    fetchRecentProjects(); // Call the async function
  }, []); // Empty dependency array makes sure it runs once when the component mounts

  const { data: session } = useSession();
  const { user } = session || {};
  const { id, image, name, team, designation } = user || {};
  console.log("Name ->", name);

  console.log("Recent Projects---> ", recentProjects);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {name?.split(" ")[0]} 👋🏻
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your hub.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Blocks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +2 projects this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mentorship Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +4 sessions this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              3 require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your most recent project activities
            </CardDescription>
          </CardHeader>
          {loading ? (
            <p>Loading...</p> // Show loading indicator while data is being fetched
          ) : (
            <CardContent className="space-y-4">
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div
                    key={project._id.toString()}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(project.startDate), "dd MMM, yy")}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent projects found.
                </p>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Mentors</CardTitle>
            <CardDescription>Most active mentors this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[{name:'Sonali', ses:4},{name:'Aashish', ses:6},{name:'Rizwan', ses:2}].map((i, num) => (
              <div key={i.name} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/40?img=${num+1}`} />
                  <AvatarFallback>M{i.name}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {i.ses} active sessions
                  </p>
                </div>
                <Trophy className="h-4 w-4 text-primary" />
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/mentorship">Find a Mentor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
