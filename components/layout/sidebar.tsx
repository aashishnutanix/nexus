"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogoMotion } from "@/components/ui/logo";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";

import { routes } from "@/lib/constants";

export function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user } = session || {};
  const { id, image, name, team, designation } = user || {};
  const { name: designationTitle } = (designation || {}) as { name?: string };

  const points = 1400;

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-card border-r border-primary pt-6 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 h-8 w-8 border border-primary rounded-full border bg-background z-50"
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
          "flex items-center justify-center mb-8",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        {isCollapsed ? <LogoMotion size="small" /> : <LogoMotion />}
      </div>

      <div
        onClick={() => router.push("/profile")}
        className={cn(
          "flex flex-col items-center px-6 mb-6 cursor-pointer",
          isCollapsed ? "px-2" : "px-6"
        )}
      >
        <div className="relative">
          <Avatar className="h-16 w-16 text-3xl border-primary border-2">
            <AvatarImage
              src={image || undefined}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <AvatarFallback>{name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 text-white p-1 bg-primary rounded-full z-20">
            <Pencil size={16} />
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-muted-foreground">{designationTitle}</p>
            <p className="text-sm text-muted-foreground">Points: {points}</p>
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
          {/* Redeem Section */}
          {/* <div>
            <Link
              href="/redeem"
              className={cn(
                "flex items-center gap-x-2 text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-primary hover:text-white",
                pathname?.startsWith("/redeem")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <ChevronRight className="h-5 w-5" />
              {!isCollapsed && <span>Redeem</span>}
            </Link>
            {!isCollapsed && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-primary">
                <Link
                  href="/redeem/rewards"
                  className={cn(
                    "block text-sm font-medium px-3 py-1 rounded-md transition-all hover:bg-accent hover:text-accent-foreground",
                    pathname === "/redeem/rewards"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Rewards
                </Link>
                <Link
                  href="/redeem/certifications"
                  className={cn(
                    "block text-sm font-medium px-3 py-1 rounded-md transition-all hover:bg-accent hover:text-accent-foreground",
                    pathname === "/redeem/certifications"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Certifications
                </Link>
              </div>
            )}
          </div> */}
        </div>
      </ScrollArea>
    </div>
  );
}
