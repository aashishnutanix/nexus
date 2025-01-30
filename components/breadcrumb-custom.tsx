"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BreadcrumbCustom() {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter((segment) => segment) || [];

  const firstSegment = pathSegments?.[0];
  const lastTwoSegments = pathSegments?.slice(-2);
  const middleSegments = pathSegments?.slice(1, -2);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">HOME</BreadcrumbLink>
        </BreadcrumbItem>
        {/* {firstSegment && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${firstSegment}`}>
                {firstSegment}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )} */}
        {middleSegments && middleSegments.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {middleSegments.map((segment, index) => (
                    <DropdownMenuItem key={index}>
                      <Link
                        href={`/${pathSegments.slice(0, index + 2).join("/")}`}
                      >
                        {segment.toUpperCase()}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
        {lastTwoSegments &&
          lastTwoSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === lastTwoSegments.length - 1 ? (
                  <BreadcrumbPage>{segment.toUpperCase()}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/${pathSegments
                      .slice(0, pathSegments.length - 2 + index + 1)
                      .join("/")}`}
                  >
                    {segment.toUpperCase()}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
