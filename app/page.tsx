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
import {
  getRecentProjects,
  getActiveProjects,
} from "@/app/(services)/projects";
import { useState, useEffect } from "react";
import { Project } from "@/lib/db/schema";

import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]); // State to hold the fetched projects
  const [loading, setLoading] = useState(true); // Loading state to handle UI during fetch
  const router = useRouter();
  const [activeUserProjects, setActiveUserProjects] = useState(0);

  const { data: session } = useSession();
  const { user } = session || {};
  const { id, image, name, team, designation } = user || {};
  console.log("Name ->", name);

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

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchActiveUserProjects = async () => {
      try {
        const res = await getActiveProjects(id!); // Await the async function
        const { success, activeProjectCount } = res;
        console.log("Recent Projects Fetched From Service-> ", recentProjects);
        setActiveUserProjects(activeProjectCount); // Set the state with fetched data
      } catch (error) {
        console.error("Error fetching projects:", error); // Error handling
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };
    fetchActiveUserProjects(); // Call the async function
  }, []);

  console.log("Recent Projects---> ", recentProjects);

  return (
    <div className="container mx-auto p-6 space-y-8 h-full">
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
            <div className="text-2xl font-bold">{activeUserProjects}</div>
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

      <div className="grid gap-4 md:grid-cols-2 mb-auto">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        router.push(`/projects/${project._id}`);
                      }}
                    >
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
                <Link href="/projects/view-projects">View All Projects</Link>
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/40?img=${i}`} />
                  <AvatarFallback>M{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Mentor {i}</p>
                  <p className="text-sm text-muted-foreground">
                    12 active sessions
                  </p>
                </div>
                <Trophy className="h-4 w-4 text-primary" />
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/mentorship/find-mentor">Find a Mentor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex items-center justify-center !mt-30">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Nutanix Inc, All rights reserved
        </p>
      </div>
    </div>
  );
}
