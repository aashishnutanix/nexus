"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/logo";

import { routes } from "@/lib/constants";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { user } = session || {};
  const { id, image, name, team, designation } = user || {};

  // useEffect(() => {
  //   async function fetchRequestCount() {
  //     const res = await fetch("/api/request/count");
  //     const data = await res.json();
  //     setRequestCount(data.count);
  //   }
  //   fetchRequestCount();
  // }, []);

  console.log("user id - ", user);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-card border-r pt-6 transition-all duration-300",
        isCollapsed ? "w-[80px] hover:w-[280px]" : "w-[280px]"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div
        className={cn(
          "flex items-center justify-center mb-8",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        {isCollapsed ? <Logo size="small" /> : <Logo />}
      </div>

      <div
        className={cn(
          "flex flex-col items-center px-6 mb-6",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        <Avatar className="h-16 w-16 mb-1 p-1 text-3xl">
          <AvatarImage src={image || undefined} />
          <AvatarFallback>{name?.[0]}</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-muted-foreground">Senior Developer</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-2">
          {routes.map((route) => {
            const isParentActive =
              route.href === pathname ||
              (route.subRoutes &&
                route.subRoutes.some((subRoute) =>
                  pathname?.startsWith(subRoute.href)
                ));

            const isSubRouteActive =
              route.subRoutes &&
              route.subRoutes.some((subRoute) => pathname === subRoute.href);

            return (
              <div key={route.label}>
                {route.href ? (
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-x-2 text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-primary hover:text-white",
                      isParentActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <route.icon
                      className={cn(
                        "h-5 w-5",
                        isCollapsed ? "h-6 w-6" : "h-5 w-5"
                      )}
                    />
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={route.onClick}
                    className={cn(
                      "flex items-center gap-x-2 text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-primary hover:text-white w-full",
                      "text-muted-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <route.icon
                      className={cn(
                        "h-5 w-5",
                        isCollapsed ? "h-6 w-6" : "h-5 w-5"
                      )}
                    />
                    {!isCollapsed && <span>{route.label}</span>}
                  </button>
                )}
                {/* Render subRoutes if available */}
                {!isCollapsed && route.subRoutes && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-primary">
                    {route.subRoutes.map((subRoute) => (
                      <Link
                        key={subRoute.href}
                        href={subRoute.href}
                        className={cn(
                          "block text-sm font-medium px-3 py-1 rounded-md transition-all hover:bg-accent hover:text-accent-foreground",
                          pathname === subRoute.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {subRoute.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
