"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Users,
  GitPullRequest,
  Trophy,
  UserCircle,
  Blocks,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Projects",
    icon: Blocks,
    href: "/projects",
  },
  {
    label: "Mentorship",
    icon: Users,
    href: "/mentorship",
  },
  {
    label: "Requests",
    icon: GitPullRequest,
    href: "/requests",
  },
  {
    label: "Leaderboard",
    icon: Trophy,
    href: "/leaderboard",
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-card border-r pt-6 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 h-8 w-8 rounded-full border bg-background z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div
        className={cn(
          "flex items-center justify-center mb-8 px-6",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        <h1 className="text-3xl font-bold tracking-tighter">
          {!isCollapsed ? "NE" : ""}
          <span className="text-primary relative">
            X
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/50 rounded-full"></span>
          </span>
          {!isCollapsed ? "US" : ""}
        </h1>
      </div>
      {/* <div className="flex justify-center mb-2">
        <h1 className="text-3xl font-bold tracking-tighter">
          NE
          <span className="text-primary relative">
            X
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/50 rounded-full"></span>
          </span>
          US
        </h1>
      </div> */}

      <div
        className={cn(
          "flex flex-col items-center px-6 mb-6",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        <Avatar className="h-16 w-16 mb-4">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-sm text-muted-foreground">Senior Developer</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <route.icon
                className={cn("h-5 w-5", isCollapsed ? "h-6 w-6" : "h-5 w-5")}
              />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
